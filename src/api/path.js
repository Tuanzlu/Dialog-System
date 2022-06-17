let Ip = {

  // 在线对话标注后端接口地址
  tagIp: "http://10.198.22.34:36000/",

  // FAQ问答管理后端接口地址
  faqIp: "http://10.198.23.65:35000/",

  // 在线聊天机器人后端接口地址
  dialogIp: "http://10.198.21.8:36100/",

};

let path = {
  website: {
    // diglog-tag
    getIntent: Ip.tagIp + "get_intent",
    saveSlot: Ip.tagIp + "get_data",
    getList: Ip.tagIp + "get_alldata",
    deleteData: Ip.tagIp + "delete_data",

    // online-chatting
    getDialogResponse: Ip.dialogIp + "senseauto/dialog",

    // app
    getAppList: Ip.faqIp + "app/list",
    createApp: Ip.faqIp + "app/create",
    updateApp: Ip.faqIp + "app/update",
    deleteApp: Ip.faqIp + "app/delete",

    // corpus
    createCorpus: Ip.faqIp + "corpus/create",
    createManyCorpus: Ip.faqIp + "corpus/create_many",
    deleteCorpus: Ip.faqIp + "corpus/delete",
    deleteManyCorpus: Ip.faqIp + "corpus/delete_many",
    updateCorpus: Ip.faqIp + "corpus/update",
    getCorpus: Ip.faqIp + "corpus/get",
    getAllCorpus: Ip.faqIp + "corpus/get_all",
    takeOnCorpus: Ip.faqIp + "corpus/take_on",
    takeOffCorpus: Ip.faqIp + "corpus/take_off",

    // model
    trainModel: Ip.faqIp + "model/train/start",
    stateModel: Ip.faqIp + "model/train/state",
    updateModelAuto: Ip.faqIp + "model/auto_train/update",
    updateModelParam: Ip.faqIp + "model/train_para/update",
    replyModel: Ip.faqIp + "model/reply",
    getModelThreshold: Ip.faqIp + "model/get_threshold",
    setModelThreshold: Ip.faqIp + "model/set_threshold",
    reloadModel: Ip.faqIp + "model/reload",
    updateModelChitchat: Ip.faqIp + "model/chitchat/update",
    updateModelSensitive: Ip.faqIp + "model/sensitive/update",
    deployModel: Ip.faqIp + "model/deploy",

    //flow
    createFlow: Ip.faqIp + "flow/create",
    getFlow: Ip.faqIp + "flow/get",
    getAllFlow: Ip.faqIp + "flow/list",
    takeOnFlow: Ip.faqIp + "flow/take_on",
    takeOffFlow: Ip.faqIp + "flow/take_off",
    deleteFlow: Ip.faqIp + "flow/delete",
    deleteManyFlow: Ip.faqIp + "flow/delete_many",
    updateFlow: Ip.faqIp + "flow/update"

  },
};
export default path;