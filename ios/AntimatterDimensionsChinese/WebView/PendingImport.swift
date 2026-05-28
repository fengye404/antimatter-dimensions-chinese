import Foundation

struct PendingImport: Equatable, Identifiable {
    let id = UUID()
    let saveText: String
}
