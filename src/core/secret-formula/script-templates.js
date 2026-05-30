import { AutobuyerInputFunctions } from "@/components/tabs/autobuyers/AutobuyerInput";

export const automatorTemplates = {
  /**
    * List of possible data types to dynamically generate in script templates, assumed to be only string or boolean
    * {
    *  @property {String} name              String to be used as a key for entries in this object
    *  @property {String[]} boolDisplay     Strings to be displayed for true/false states for boolean inputs. If
    *   undefined, assumed to be a non-boolean input
    *  @property {Function} isValidString   A function used to test if an input string is formatted properly or not
    *  @property {Function} map             A function to be used to map the inputs to their actual values
    *   which are stored in the param object. If undefined, assumed to be no mapping
    * }
    */
  paramTypes: [
    {
      name: "tree",
      isValidString: str => {
        const validImport = TimeStudyTree.isValidImportString(str);
        const preset = str.match(/^(NAME (.{1,4})|ID (\d))$/u);
        const validPreset = preset ? (
          player.timestudy.presets.some(p => p.name === preset[2]) ||
          (Number(preset[3]) > 0 && Number(preset[3]) < 7)
        ) : false;
        return validImport || validPreset;
      },
    },
    {
      name: "integer",
      isValidString: str => AutobuyerInputFunctions.int.tryParse(str),
      map: x => Math.round(parseInt(x, 10)),
    },
    {
      name: "decimal",
      isValidString: str => AutobuyerInputFunctions.decimal.tryParse(str),
      map: x => AutobuyerInputFunctions.decimal.tryParse(x),
    },
    {
      name: "boolean",
      boolDisplay: [true, false],
    },
    {
      name: "nowait",
      boolDisplay: ["继续执行", "反复购买研究"],
    },
    {
      name: "mode",
      boolDisplay: ["达到最高值的 X 倍", "距上次重置的秒数"],
      map: x => (x ? "mult" : "time"),
    },
  ],
  /**
    * List automator script templates, primarily used here for formatting the player UI prompts appropriately
    * so that all of the required fields show up in the proper input formats. Actual script formatting requires
    * additionally writing a method to be called in the constructor of the ScriptTemplate class
    * {
    *  @property {String} name          Name of script template, also used as a key within the constructor for
    *   ScriptTemplate objects
    *  @property {String} description   Text description of what the template does when used in the automator
    *  @property {Object[]} inputs      Fields of the param object which need to be filled for the template to
    *   have all the information it needs. Contains the name of the field, the type (drawn from paramTypes above),
    *   and a prompt to be shown in the UI end
    *  @property {Function} warnings    Function which checks the current game state and potentially provides
    *   warnings based on some possibly common cases which may lead to undesired behavior
    * }
    */
  scripts: [
    {
      name: "Climb EP",
      displayName: "刷永恒点数",
      description: `反复进行永恒，并在每次永恒后重新购买指定时间研究树。你需要提供无限和永恒自动购买器设置；
        脚本会一直运行，直到永恒点数达到目标值。`,
      inputs: [
        { name: "treeStudies", type: "tree", prompt: "或直接输入时间研究" },
        { name: "treeNowait", type: "nowait", prompt: "缺少研究时的处理方式" },
        { name: "finalEP", type: "decimal", prompt: "目标 EP" },
        { name: "autoInfMode", type: "mode", prompt: "无限自动购买器模式" },
        { name: "autoInfValue", type: "decimal", prompt: "无限自动购买器阈值" },
        { name: "autoEterMode", type: "mode", prompt: "永恒自动购买器模式" },
        { name: "autoEterValue", type: "decimal", prompt: "永恒自动购买器阈值" },
      ],
      warnings: () => {
        const list = [];
        if (!RealityUpgrade(10).isBought) {
          list.push(`永恒次数少于 ${formatInt(100)} 时，脚本无法可靠设置自动购买器模式。建议在现实初期使用前，
            先解锁现实升级“${RealityUpgrade(10).name}”。`);
        }
        // Telemechanical Process (TD/5xEP autobuyers)
        if (!RealityUpgrade(13).isBought) {
          list.push(`没有现实升级“${RealityUpgrade(13).name}”时，这个模板的效率可能偏低。`);
        }
        if (!Perk.ttBuySingle.isBought) {
          list.push(`没有特权“${Perk.ttBuySingle.label}”时，除非你已经能自动产生时间定理，否则这个模板的效率可能偏低。`);
        }
        return list;
      },
    },
    {
      name: "Grind Eternities",
      displayName: "刷永恒次数",
      description: `购买指定时间研究树后，反复进行快速永恒。无限自动购买器会按“达到最高值的若干倍”触发，
        永恒自动购买器会尽快触发；脚本会一直运行，直到永恒次数达到目标值。`,
      inputs: [
        { name: "treeStudies", type: "tree", prompt: "或直接输入时间研究" },
        { name: "treeNowait", type: "nowait", prompt: "缺少研究时的处理方式" },
        { name: "crunchesPerEternity", type: "integer", prompt: "每次永恒前大坍缩次数" },
        { name: "eternities", type: "decimal", prompt: "目标永恒次数" },
      ],
      warnings: () => {
        const list = [];
        // Eternal flow (eternity generation)
        if (RealityUpgrade(14).isBought) {
          list.push(`你已经拥有现实升级“${RealityUpgrade(14).name}”，通常不再需要这个模板。`);
        }
        return list;
      },
    },
    {
      name: "Grind Infinities",
      displayName: "刷无限次数",
      description: `购买指定时间研究树后，配置自动购买器来获取无限次数。脚本会一直运行到无限次数达到目标；
        目标也可以是“存储的无限次数”，这种情况下脚本会在一次永恒前尽量获取所有无限次数。`,
      inputs: [
        { name: "treeStudies", type: "tree", prompt: "或直接输入时间研究" },
        { name: "treeNowait", type: "nowait", prompt: "缺少研究时的处理方式" },
        { name: "infinities", type: "decimal", prompt: "目标无限次数" },
        { name: "isBanked", type: "boolean", prompt: "目标使用存储的无限次数？" },
      ],
      warnings: () => {
        const list = [];
        if (!Perk.achievementGroup5.isBought) {
          list.push(`本次现实开局不会保留成就“${Achievement(131).name}”。在能存储无限次数之前，
            刷无限次数的收益可能低于预期。`);
        }
        // Boundless flow (infinity generation)
        if (RealityUpgrade(11).isBought) {
          list.push(`你已经拥有现实升级“${RealityUpgrade(11).name}”，通常不再需要这个模板。`);
        }
        return list;
      },
    },
    {
      name: "Complete Eternity Challenge",
      displayName: "完成永恒挑战",
      description: `购买指定时间研究树后，解锁指定永恒挑战；随后按你的设置配置无限自动购买器并进入挑战。
        脚本会等到挑战完成次数达到目标后触发永恒，从而完成挑战。`,
      inputs: [
        { name: "treeStudies", type: "tree", prompt: "或直接输入时间研究" },
        { name: "treeNowait", type: "nowait", prompt: "缺少研究时的处理方式" },
        { name: "ec", type: "integer", prompt: "永恒挑战编号" },
        { name: "completions", type: "integer", prompt: "目标完成次数" },
        { name: "autoInfMode", type: "mode", prompt: "无限自动购买器模式" },
        { name: "autoInfValue", type: "decimal", prompt: "无限自动购买器阈值" },
      ],
      warnings: () => {
        const list = [];
        if (!Perk.studyECRequirement.isBought) {
          list.push(`部分永恒挑战还有额外资源要求，可能无法稳定解锁。建议先解锁特权“${Perk.studyECRequirement.label}”。`);
        }
        if (!Perk.studyECBulk.isBought) {
          list.push(`没有永恒挑战批量完成时，这个模板可能生成较长、较慢且不易修改的脚本。
            解锁特权“${Perk.studyECBulk.label}”后，建议回来简化脚本。`);
        }
        return list;
      },
    },
    {
      name: "Unlock Dilation",
      displayName: "解锁时间膨胀",
      description: `反复进行永恒，并在每次永恒后重新购买指定时间研究树。你需要提供永恒自动购买器设置；
        无限自动购买器会被关闭。脚本会循环到时间定理总数满足解锁时间膨胀的要求，然后自动解锁。`,
      inputs: [
        { name: "treeStudies", type: "tree", prompt: "或直接输入时间研究" },
        { name: "treeNowait", type: "nowait", prompt: "缺少研究时的处理方式" },
        { name: "finalEP", type: "decimal", prompt: "目标 EP" },
        { name: "autoEterMode", type: "mode", prompt: "永恒自动购买器模式" },
        { name: "autoEterValue", type: "decimal", prompt: "永恒自动购买器阈值" },
      ],
      warnings: () => {
        const list = [];
        // Telemechanical Process (TD/5xEP autobuyers)
        if (!RealityUpgrade(13).isBought) {
          list.push(`没有现实升级“${RealityUpgrade(13).name}”时，这个模板的效率可能偏低。`);
        }
        if (!Perk.ttBuySingle.isBought) {
          list.push(`没有特权“${Perk.ttBuySingle.label}”时，除非你已经能自动产生时间定理，否则这个模板的效率可能偏低。`);
        }
        return list;
      },
    },
  ]
};
