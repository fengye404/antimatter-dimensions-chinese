import SwiftUI
import UIKit

struct RootView: View {
    let saveStore: SaveStore

    @State private var reloadToken = UUID()
    @State private var clearDataToken = UUID()
    @State private var pendingImport: PendingImport?
    @State private var shareItem: ShareItem?
    @State private var alertItem: AlertItem?
    @State private var statusText = "准备载入游戏"
    @State private var isGameVisible = false

    var body: some View {
        ZStack(alignment: .topTrailing) {
            Color(red: 0.05, green: 0.05, blue: 0.07)
                .ignoresSafeArea()

            GameWebView(
                saveStore: saveStore,
                reloadToken: reloadToken,
                clearDataToken: clearDataToken,
                pendingImport: pendingImport,
                onStatus: handleStatus,
                onExportRequested: exportSave
            )
            .ignoresSafeArea(.container, edges: .bottom)
            .opacity(isGameVisible ? 1 : 0)
            .animation(.easeOut(duration: 0.35), value: isGameVisible)

            if !isGameVisible {
                loadingView
                    .transition(.opacity)
            }

            nativeMenu
                .padding(.top, 112)
                .padding(.trailing, 16)
        }
        .sheet(item: $shareItem) { item in
            ShareSheet(activityItems: [item.text])
        }
        .alert(item: $alertItem) { item in
            Alert(title: Text(item.title), message: Text(item.message), dismissButton: .default(Text("知道了")))
        }
    }

    private var loadingView: some View {
        VStack(spacing: 18) {
            VStack(spacing: 6) {
                Text("反物质维度")
                    .font(.system(size: 34, weight: .heavy, design: .rounded))
                    .foregroundStyle(Color(red: 1.0, green: 0.35, blue: 0.37))
                Text("正在载入离线游戏")
                    .font(.system(size: 16, weight: .semibold, design: .rounded))
                    .foregroundStyle(.secondary)
            }

            ProgressView()
                .tint(Color(red: 1.0, green: 0.35, blue: 0.37))

            Text(statusText)
                .font(.system(size: 13, weight: .medium, design: .rounded))
                .foregroundStyle(.secondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(
            RadialGradient(
                colors: [
                    Color(red: 0.20, green: 0.08, blue: 0.10).opacity(0.42),
                    Color(red: 0.05, green: 0.05, blue: 0.07)
                ],
                center: .top,
                startRadius: 60,
                endRadius: 520
            )
        )
    }

    private var nativeMenu: some View {
        Menu {
            Button("重新载入游戏") {
                reloadToken = UUID()
            }
            Button("导出当前存档") {
                exportSave()
            }
            Button("从剪贴板导入存档") {
                importFromPasteboard()
            }
            Button("清理 WebView 缓存") {
                clearDataToken = UUID()
            }
            Divider()
            Text(statusText)
        } label: {
            Label("存档", systemImage: "tray.and.arrow.down.fill")
                .font(.system(size: 14, weight: .bold, design: .rounded))
                .foregroundStyle(.white.opacity(0.72))
                .padding(.horizontal, 8)
                .padding(.vertical, 6)
                .contentShape(Capsule())
                .accessibilityLabel("iOS 操作菜单")
        }
    }

    private func exportSave() {
        do {
            shareItem = ShareItem(text: try saveStore.exportPrimarySave())
        } catch {
            alertItem = AlertItem(title: "暂时没有可导出的存档", message: error.localizedDescription)
        }
    }

    private func importFromPasteboard() {
        guard let text = UIPasteboard.general.string?.trimmingCharacters(in: .whitespacesAndNewlines),
              !text.isEmpty else {
            alertItem = AlertItem(title: "剪贴板为空", message: "请先复制一段 Antimatter Dimensions 存档文本。")
            return
        }

        do {
            try saveStore.importPrimarySave(text)
            pendingImport = PendingImport(saveText: text)
            alertItem = AlertItem(title: "导入完成", message: "存档已写入 App 内部存储，并会刷新游戏页面。")
        } catch {
            alertItem = AlertItem(title: "导入失败", message: error.localizedDescription)
        }
    }

    private func handleStatus(_ status: String) {
        statusText = status
        if status == "游戏已载入" {
            isGameVisible = true
        }
    }
}

private struct AlertItem: Identifiable {
    let id = UUID()
    let title: String
    let message: String
}

private struct ShareItem: Identifiable {
    let id = UUID()
    let text: String
}

private struct ShareSheet: UIViewControllerRepresentable {
    let activityItems: [Any]

    func makeUIViewController(context: Context) -> UIActivityViewController {
        UIActivityViewController(activityItems: activityItems, applicationActivities: nil)
    }

    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {}
}
