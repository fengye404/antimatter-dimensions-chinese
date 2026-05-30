import SwiftUI
import WebKit

final class WebViewCoordinator: NSObject, WKNavigationDelegate, WKUIDelegate {
    var parent: GameWebView
    let bridge: NativeBridge
    var lastReloadToken: UUID
    var lastClearDataToken: UUID
    var lastImportID: UUID?

    init(parent: GameWebView) {
        self.parent = parent
        self.bridge = NativeBridge(saveStore: parent.saveStore)
        self.lastReloadToken = parent.reloadToken
        self.lastClearDataToken = parent.clearDataToken
        super.init()
        bridge.onExportRequested = { [weak self] in
            self?.parent.onExportRequested()
        }
        bridge.onStatus = { [weak self] status in
            DispatchQueue.main.async {
                self?.parent.onStatus(status)
            }
        }
    }

    func loadGame(in webView: WKWebView) {
        installUserScripts(in: webView)

        guard let indexURL = Bundle.main.url(forResource: "index", withExtension: "html", subdirectory: "Web") else {
            webView.loadHTMLString(Self.missingAssetsHTML, baseURL: nil)
            return
        }

        let webDirectoryURL = indexURL.deletingLastPathComponent()
        webView.loadFileURL(indexURL, allowingReadAccessTo: webDirectoryURL)
    }

    func injectPrimarySave(_ saveText: String, in webView: WKWebView) {
        let script = """
        localStorage.setItem("dimensionSave", \(Self.javaScriptLiteral(saveText)));
        if (window.ADNative && window.ADNative.syncSave) {
          window.ADNative.syncSave("native-import");
        }
        location.reload();
        """
        webView.evaluateJavaScript(script)
    }

    func clearWebsiteDataAndReload(_ webView: WKWebView) {
        let types = WKWebsiteDataStore.allWebsiteDataTypes()
        WKWebsiteDataStore.default().removeData(ofTypes: types, modifiedSince: .distantPast) { [weak self, weak webView] in
            DispatchQueue.main.async {
                guard let self, let webView else { return }
                self.loadGame(in: webView)
                self.parent.onStatus("WebView 缓存已清理，正在从 App 存档恢复")
            }
        }
    }

    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        parent.onStatus("游戏页面已打开")
    }

    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        parent.onStatus("页面载入失败：\(error.localizedDescription)")
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        parent.onStatus("页面载入失败：\(error.localizedDescription)")
    }

    func webView(_ webView: WKWebView,
                 decidePolicyFor navigationAction: WKNavigationAction,
                 decisionHandler: @escaping @MainActor @Sendable (WKNavigationActionPolicy) -> Void) {
        guard let url = navigationAction.request.url else {
            decisionHandler(.allow)
            return
        }

        if url.isFileURL || url.scheme == "about" {
            decisionHandler(.allow)
            return
        }

        if ["http", "https", "mailto"].contains(url.scheme) {
            UIApplication.shared.open(url)
            decisionHandler(.cancel)
            return
        }

        decisionHandler(.allow)
    }

    func webView(_ webView: WKWebView,
                 createWebViewWith configuration: WKWebViewConfiguration,
                 for navigationAction: WKNavigationAction,
                 windowFeatures: WKWindowFeatures) -> WKWebView? {
        if let url = navigationAction.request.url {
            UIApplication.shared.open(url)
        }
        return nil
    }

    private func installUserScripts(in webView: WKWebView) {
        let contentController = webView.configuration.userContentController
        contentController.removeAllUserScripts()

        let restoredRecords = Self.javaScriptLiteral(parent.saveStore.allValues())
        let bridgeScript = Self.bridgeScript(restoredRecordsLiteral: restoredRecords)
        contentController.addUserScript(WKUserScript(source: bridgeScript, injectionTime: .atDocumentStart, forMainFrameOnly: true))
    }

    private static func bridgeScript(restoredRecordsLiteral: String) -> String {
        """
        (function () {
          const handler = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.adNative;
          if (!handler) { return; }

          const restoredRecords = \(restoredRecordsLiteral);
          if (restoredRecords && typeof restoredRecords === "object") {
            for (const key of Object.keys(restoredRecords)) {
              const value = restoredRecords[key];
              if (
                typeof value === "string" &&
                value.length > 0 &&
                (key === "dimensionSave" || key.indexOf("backupSave-") === 0 || key.indexOf("backupTimes-") === 0)
              ) {
                localStorage.setItem(key, value);
              }
            }
          }

          function collectRecords() {
            const records = {};
            for (let i = 0; i < localStorage.length; i += 1) {
              const key = localStorage.key(i);
              if (key === "dimensionSave" || key.indexOf("backupSave-") === 0 || key.indexOf("backupTimes-") === 0) {
                records[key] = localStorage.getItem(key);
              }
            }
            return records;
          }

          function post(payload) {
            try { handler.postMessage(payload); } catch (error) {}
          }

          function syncSave(reason) {
            post({
              type: "save",
              reason: reason || "web",
              timestamp: Date.now(),
              records: collectRecords()
            });
          }

          window.ADNative = {
            syncSave: syncSave,
            exportSave: function () { post({ type: "export" }); }
          };

          const originalSetItem = localStorage.setItem;
          localStorage.setItem = function (key, value) {
            originalSetItem.apply(this, arguments);
            if (key === "dimensionSave" || key.indexOf("backupSave-") === 0 || key.indexOf("backupTimes-") === 0) {
              syncSave("localStorage.setItem:" + key);
            }
          };

          window.addEventListener("pagehide", function () { syncSave("pagehide"); });
          document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === "hidden") syncSave("visibility-hidden");
          });
          window.addEventListener("load", function () {
            post({ type: "ready", timestamp: Date.now() });
            syncSave("load");
          });
        }());
        """
    }

    private static func javaScriptLiteral(_ value: Any) -> String {
        if let string = value as? String,
           let data = try? JSONEncoder().encode(string),
           let literal = String(data: data, encoding: .utf8) {
            return literal
        }

        guard let data = try? JSONSerialization.data(withJSONObject: value, options: []),
              let literal = String(data: data, encoding: .utf8) else {
            return "null"
        }
        return literal
    }

    private static let missingAssetsHTML = """
    <!doctype html>
    <html lang="zh-CN">
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
      <style>
        body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #101014; color: #f4f4f5; font: 17px -apple-system, BlinkMacSystemFont, sans-serif; }
        main { max-width: 520px; padding: 28px; text-align: center; }
        code { color: #7ee787; }
      </style>
    </head>
    <body>
      <main>
        <h1>还没有同步游戏资源</h1>
        <p>请在仓库根目录运行 <code>npm run build:ios</code>，然后重新构建 iOS App。</p>
      </main>
    </body>
    </html>
    """
}
