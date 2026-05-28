import SwiftUI
import WebKit

struct GameWebView: UIViewRepresentable {
    let saveStore: SaveStore
    let reloadToken: UUID
    let clearDataToken: UUID
    let pendingImport: PendingImport?
    let onStatus: (String) -> Void
    let onExportRequested: () -> Void

    func makeCoordinator() -> WebViewCoordinator {
        WebViewCoordinator(parent: self)
    }

    func makeUIView(context: Context) -> WKWebView {
        let configuration = WKWebViewConfiguration()
        configuration.defaultWebpagePreferences.allowsContentJavaScript = true
        configuration.allowsInlineMediaPlayback = true
        configuration.userContentController.add(context.coordinator.bridge, name: "adNative")

        let webView = WKWebView(frame: .zero, configuration: configuration)
        webView.navigationDelegate = context.coordinator
        webView.uiDelegate = context.coordinator
        webView.allowsBackForwardNavigationGestures = false
        webView.isOpaque = false
        webView.backgroundColor = UIColor(red: 0.04, green: 0.04, blue: 0.06, alpha: 1)
        webView.scrollView.backgroundColor = webView.backgroundColor
        webView.scrollView.contentInsetAdjustmentBehavior = .never

        context.coordinator.loadGame(in: webView)
        return webView
    }

    func updateUIView(_ webView: WKWebView, context: Context) {
        context.coordinator.parent = self

        if context.coordinator.lastReloadToken != reloadToken {
            context.coordinator.lastReloadToken = reloadToken
            context.coordinator.loadGame(in: webView)
        }

        if context.coordinator.lastClearDataToken != clearDataToken {
            context.coordinator.lastClearDataToken = clearDataToken
            context.coordinator.clearWebsiteDataAndReload(webView)
        }

        if let pendingImport, context.coordinator.lastImportID != pendingImport.id {
            context.coordinator.lastImportID = pendingImport.id
            context.coordinator.injectPrimarySave(pendingImport.saveText, in: webView)
        }
    }

    static func dismantleUIView(_ uiView: WKWebView, coordinator: WebViewCoordinator) {
        uiView.configuration.userContentController.removeScriptMessageHandler(forName: "adNative")
    }
}
