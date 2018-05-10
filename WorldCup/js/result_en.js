
//var dappAddress = "n1fvAdUKi1qK8gowLCEj5kAGK7QzgFSo4p9";
var dappAddress = "n1y4pC21TfewQhYkQNkeq3ZKbdyyTSvM2rK";

var allteam = new Array();
allteam["danmai"] = "Denmark";
allteam["wulagui"] = "Uruguay";
allteam["yilang"] = "Iran";
allteam["erluoshi"] = "Russian";
allteam["keluodya"] = "Croatia";
allteam["bingdao"] = "Iceland";
allteam["gelunbiya"] = "Colombia";
allteam["gesidalijia"] = "CostaRica";
allteam["aiji"] = "Egypt";
allteam["saierjiaer"] = "Senegal";
allteam["saierweiya"] = "Serbia";
allteam["moxige"] = "Mexico";
allteam["niriliya"] = "Nigeria";
allteam["banama"] = "Panama";
allteam["baxi"] = "Brazil";
allteam["deguo"] = "Germany";
allteam["moluoge"] = "Morocco";
allteam["riben"] = "Japan";
allteam["bilishi"] = "Belgium";
allteam["shate"] = "SaudiArabia";
allteam["faguo"] = "France";
allteam["bolan"] = "Poland";
allteam["aodaliya"] = "Australia";
allteam["ruidian"] = "Sweden";
allteam["ruishi"] = "Switzerland";
allteam["milu"] = "Peru";
allteam["tunisi"] = "Tunisia";
allteam["yinggelan"] = "England";
allteam["putaoya"] = "Portugal";
allteam["xibanya"] = "Spain";
allteam["agenting"] = "Argentina";
allteam["hanguo"] = "Korea";

var allteam_cn = new Array();
allteam_cn["danmai"] = "丹麦";
allteam_cn["wulagui"] = "乌拉圭";
allteam_cn["yilang"] = "伊朗";
allteam_cn["erluoshi"] = "俄罗斯";
allteam_cn["keluodya"] = "克罗地亚";
allteam_cn["bingdao"] = "冰岛";
allteam_cn["gelunbiya"] = "哥伦比亚";
allteam_cn["gesidalijia"] = "哥斯达黎加";
allteam_cn["aiji"] = "埃及";
allteam_cn["saierjiaer"] = "塞内加尔";
allteam_cn["saierweiya"] = "塞尔维亚";
allteam_cn["moxige"] = "墨西哥";
allteam_cn["niriliya"] = "尼日利亚";
allteam_cn["banama"] = "巴拿马";
allteam_cn["baxi"] = "巴西";
allteam_cn["deguo"] = "德国";
allteam_cn["moluoge"] = "摩洛哥";
allteam_cn["riben"] = "日本";
allteam_cn["bilishi"] = "比利时";
allteam_cn["shate"] = "沙特";
allteam_cn["faguo"] = "法国";
allteam_cn["bolan"] = "波兰";
allteam_cn["aodaliya"] = "澳大利亚";
allteam_cn["ruidian"] = "瑞典";
allteam_cn["ruishi"] = "瑞士";
allteam_cn["milu"] = "秘鲁";
allteam_cn["tunisi"] = "	突尼斯";
allteam_cn["yinggelan"] = "英格兰";
allteam_cn["putaoya"] = "葡萄牙";
allteam_cn["xibanya"] = "西班牙";
allteam_cn["agenting"] = "阿根廷";
allteam_cn["hanguo"] = "韩国";

document.addEventListener("DOMContentLoaded", function () {
    console.log("web page loaded...")
    $("#noExtension").hide();
    setTimeout(checkNebpay, 100);
});

window.addEventListener('message', function (e) {
    // e.detail contains the transferred data
    console.log("recived by page:" + e + ", e.data:" + JSON.stringify(e.data));
    if (!!e.data.data.account) {
        //document.getElementById("accountAddress").innerHTML= "Account address: " + e.data.data.account;
    }
    if (!!e.data.data.receipt) {
        //document.getElementById("txResult").innerHTML = "Transaction Receipt\n" +  JSON.stringify(e.data.data.receipt,null,'\t');
        console.log(JSON.stringify(e.data.data.receipt, null, '\t'));
    }
    if (!!e.data.data.neb_call) {

        var result = e.data.data.neb_call.result
        var execute_err = e.data.data.neb_call.execute_err;

        console.log("return of rpc call: " + result)
        if (execute_err == 'null' || execute_err == 'undefined' || execute_err == '') {
            result = JSON.parse(e.data.data.neb_call.result);
            bindresult(result);
        }
        else {
            alert(execute_err);
        }

    }
});

function checkNebpay() {
    console.log("check nebpay")
    try {
        var NebPay = require("nebpay");
        if (NebPay === "null" || NebPay === "undefined") {
            //引入API
            var NebPay = require("nebpay");

            //检测浏览器是否安装星云钱包
            if (typeof (webExtensionWallet) === "undefined") {
                $("#noExtension").show();
            } else {
                console.log('星云钱包环境运行成功');
            }
        }

        votesearch();
    } catch (e) {
        //alert ("Extension wallet is not installed, please install it first.")
        $("#noExtension").show();
    }

};

function votesearch() {
    console.log("********* call smart contract by \"call\" *****************")
    var func = "queryall"
    var args = ""

    window.postMessage({
        "target": "contentscript",
        "data": {
            "to": dappAddress,
            "value": "0",
            "contract": {
                "function": func,
                "args": args
            }
        },
        "method": "neb_call"
    }, "*");

}

function bindresult(result)
{
    function NumDescSort(a, b) {
        return b.supportNum - a.supportNum;
    }
    var index1 = 0;
    result.sort(NumDescSort);
    result.forEach(function (item, index, input) {
        if (allteam[item.teamId] != null && allteam[item.teamId] != undefined) {
            //添加text ，存放指标权重  
            var div1 = document.createElement("div");
            if (index == 0)
                div1.setAttribute('class', 'team-div team-div-this');
            else
                div1.setAttribute('class', 'team-div');

            var div2 = document.createElement("div");
            if (index <= 3)
                div2.setAttribute('class', 'team-index team-index' + (index1 + 1));
            else
                div2.setAttribute('class', 'team-index team-index');

            div1.appendChild(div2);
            var div3 = document.createElement("div");
            div3.setAttribute('class', 'team-icon');
            var img = document.createElement("img");
            img.setAttribute('src', '../img/' + allteam_cn[item.teamId] + ".png");
            div3.appendChild(img);
            div1.appendChild(div3);
            var div4 = document.createElement("div");
            div4.setAttribute('class', 'team-txt');
            div4.innerText = allteam[item.teamId];
            div1.appendChild(div4);
            var div5 = document.createElement("div");
            div5.setAttribute('class', 'team-num');
            div5.innerText = item.supportNum + " Fans";
            div1.appendChild(div5);
            $('.team-wrap').append(div1);
            index1++;
        }
        
    })
}

