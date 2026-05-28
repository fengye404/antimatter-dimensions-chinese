import Foundation

struct SaveEnvelope: Codable, Equatable {
    var version: Int
    var updatedAt: Date
    var records: [String: SaveRecord]

    init(version: Int = 1, updatedAt: Date = Date(), records: [String: SaveRecord] = [:]) {
        self.version = version
        self.updatedAt = updatedAt
        self.records = records
    }
}

struct SaveRecord: Codable, Equatable {
    var key: String
    var value: String
    var timestamp: Date
    var reason: String

    init(key: String, value: String, timestamp: Date = Date(), reason: String = "unknown") {
        self.key = key
        self.value = value
        self.timestamp = timestamp
        self.reason = reason
    }
}
