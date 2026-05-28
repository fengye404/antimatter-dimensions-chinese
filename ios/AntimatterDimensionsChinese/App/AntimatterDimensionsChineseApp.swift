import SwiftUI

@main
struct AntimatterDimensionsChineseApp: App {
    private let saveStore = SaveStore()

    var body: some Scene {
        WindowGroup {
            RootView(saveStore: saveStore)
        }
    }
}
