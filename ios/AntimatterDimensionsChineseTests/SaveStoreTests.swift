import XCTest
@testable import AntimatterDimensionsChinese

final class SaveStoreTests: XCTestCase {
    private var temporaryDirectory: URL!

    override func setUpWithError() throws {
        temporaryDirectory = FileManager.default.temporaryDirectory
            .appendingPathComponent("SaveStoreTests-\(UUID().uuidString)", isDirectory: true)
        try FileManager.default.createDirectory(at: temporaryDirectory, withIntermediateDirectories: true)
    }

    override func tearDownWithError() throws {
        if let temporaryDirectory {
            try? FileManager.default.removeItem(at: temporaryDirectory)
        }
    }

    func testPrimarySaveRoundTrip() throws {
        let store = SaveStore(directoryURL: temporaryDirectory)

        try store.importPrimarySave("AntimatterSavePayload")

        XCTAssertEqual(store.latestValue(), "AntimatterSavePayload")
        XCTAssertEqual(try store.exportPrimarySave(), "AntimatterSavePayload")
    }

    func testNewerRecordWins() throws {
        let store = SaveStore(directoryURL: temporaryDirectory)
        let oldRecord = SaveRecord(
            key: SaveStore.primarySaveKey,
            value: "old",
            timestamp: Date(timeIntervalSince1970: 1),
            reason: "test"
        )
        let newRecord = SaveRecord(
            key: SaveStore.primarySaveKey,
            value: "new",
            timestamp: Date(timeIntervalSince1970: 2),
            reason: "test"
        )

        try store.save(record: newRecord)
        try store.save(record: oldRecord)

        XCTAssertEqual(store.latestValue(), "new")
    }

    func testBatchSaveKeepsBackupKeys() throws {
        let store = SaveStore(directoryURL: temporaryDirectory)

        try store.saveRecords([
            SaveRecord(key: SaveStore.primarySaveKey, value: "main"),
            SaveRecord(key: "backupSave-0-0", value: "backup"),
            SaveRecord(key: "backupTimes-0", value: "[123]")
        ])

        XCTAssertEqual(store.latestValue(), "main")
        XCTAssertEqual(store.latestValue(for: "backupSave-0-0"), "backup")
        XCTAssertEqual(store.latestValue(for: "backupTimes-0"), "[123]")
    }

    func testEmptyImportThrows() {
        let store = SaveStore(directoryURL: temporaryDirectory)

        XCTAssertThrowsError(try store.importPrimarySave("   "))
    }
}
