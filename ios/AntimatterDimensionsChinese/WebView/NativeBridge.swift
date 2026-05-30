import Foundation
import WebKit

final class NativeBridge: NSObject, WKScriptMessageHandler {
    private let saveStore: SaveStore
    var onExportRequested: (() -> Void)?
    var onStatus: ((String) -> Void)?

    init(saveStore: SaveStore) {
        self.saveStore = saveStore
    }

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard message.name == "adNative",
              let payload = message.body as? [String: Any],
              let type = payload["type"] as? String else {
            return
        }

        switch type {
        case "ready":
            onStatus?("游戏已载入")
        case "save":
            handleSave(payload)
        case "export":
            onExportRequested?()
        default:
            break
        }
    }

    private func handleSave(_ payload: [String: Any]) {
        let reason = payload["reason"] as? String ?? "web"
        let timestamp = date(from: payload["timestamp"])

        if let records = payload["records"] as? [String: String] {
            let saveRecords = records.map { key, value in
                SaveRecord(key: key, value: value, timestamp: timestamp, reason: reason)
            }
            do {
                try saveStore.saveRecords(saveRecords)
                onStatus?("存档已保存到 App")
            } catch {
                onStatus?("App 存档保存失败：\(error.localizedDescription)")
            }
            return
        }

        guard let key = payload["key"] as? String,
              let value = payload["value"] as? String else {
            return
        }

        do {
            try saveStore.save(record: SaveRecord(key: key, value: value, timestamp: timestamp, reason: reason))
            onStatus?("存档已保存到 App")
        } catch {
            onStatus?("App 存档保存失败：\(error.localizedDescription)")
        }
    }

    private func date(from value: Any?) -> Date {
        if let milliseconds = value as? TimeInterval {
            return Date(timeIntervalSince1970: milliseconds / 1000)
        }
        if let number = value as? NSNumber {
            return Date(timeIntervalSince1970: number.doubleValue / 1000)
        }
        return Date()
    }
}
