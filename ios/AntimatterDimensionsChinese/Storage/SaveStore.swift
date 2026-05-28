import Foundation

enum SaveStoreError: LocalizedError {
    case emptySave
    case invalidDirectory

    var errorDescription: String? {
        switch self {
        case .emptySave:
            return "存档内容为空。"
        case .invalidDirectory:
            return "无法定位应用存档目录。"
        }
    }
}

final class SaveStore {
    static let primarySaveKey = "dimensionSave"

    private let directoryURL: URL
    private let fileURL: URL
    private let queue = DispatchQueue(label: "com.fengye.antimatterdimensionschinese.savestore")
    private let encoder: JSONEncoder
    private let decoder: JSONDecoder

    init(directoryURL: URL? = nil) {
        let baseURL = directoryURL ?? FileManager.default.urls(for: .applicationSupportDirectory, in: .userDomainMask)
            .first?
            .appendingPathComponent("AntimatterDimensionsChinese", isDirectory: true)
        self.directoryURL = baseURL ?? FileManager.default.temporaryDirectory
            .appendingPathComponent("AntimatterDimensionsChinese", isDirectory: true)
        self.fileURL = self.directoryURL.appendingPathComponent("saves.json", isDirectory: false)

        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        encoder.outputFormatting = [.prettyPrinted, .sortedKeys]
        self.encoder = encoder

        let decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
        self.decoder = decoder
    }

    func save(record: SaveRecord) throws {
        try queue.sync {
            guard !record.value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else {
                throw SaveStoreError.emptySave
            }

            var envelope = try readEnvelopeUnlocked()
            let existing = envelope.records[record.key]
            if existing == nil || record.timestamp >= existing!.timestamp {
                envelope.records[record.key] = record
                envelope.updatedAt = max(envelope.updatedAt, record.timestamp)
                try writeEnvelopeUnlocked(envelope)
            }
        }
    }

    func saveRecords(_ records: [SaveRecord]) throws {
        try queue.sync {
            var envelope = try readEnvelopeUnlocked()
            var didChange = false

            for record in records where !record.value.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                let existing = envelope.records[record.key]
                if existing == nil || record.timestamp >= existing!.timestamp {
                    envelope.records[record.key] = record
                    envelope.updatedAt = max(envelope.updatedAt, record.timestamp)
                    didChange = true
                }
            }

            if didChange {
                try writeEnvelopeUnlocked(envelope)
            }
        }
    }

    func latestValue(for key: String = SaveStore.primarySaveKey) -> String? {
        queue.sync {
            guard let envelope = try? readEnvelopeUnlocked() else { return nil }
            return envelope.records[key]?.value
        }
    }

    func importPrimarySave(_ value: String, reason: String = "native-import") throws {
        let trimmed = value.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { throw SaveStoreError.emptySave }
        try save(record: SaveRecord(key: SaveStore.primarySaveKey, value: trimmed, reason: reason))
    }

    func exportPrimarySave() throws -> String {
        guard let value = latestValue(), !value.isEmpty else {
            throw SaveStoreError.emptySave
        }
        return value
    }

    func clear() throws {
        try queue.sync {
            if FileManager.default.fileExists(atPath: fileURL.path) {
                try FileManager.default.removeItem(at: fileURL)
            }
        }
    }

    private func readEnvelopeUnlocked() throws -> SaveEnvelope {
        guard FileManager.default.fileExists(atPath: fileURL.path) else {
            return SaveEnvelope()
        }
        let data = try Data(contentsOf: fileURL)
        return try decoder.decode(SaveEnvelope.self, from: data)
    }

    private func writeEnvelopeUnlocked(_ envelope: SaveEnvelope) throws {
        try FileManager.default.createDirectory(at: directoryURL, withIntermediateDirectories: true)
        let data = try encoder.encode(envelope)
        try data.write(to: fileURL, options: [.atomic])
    }
}
