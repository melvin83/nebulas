﻿
//var dappAddress = "n1fvAdUKi1qK8gowLCEj5kAGK7QzgFSo4p9";
var dappAddress = "n1y4pC21TfewQhYkQNkeq3ZKbdyyTSvM2rK";

var allteam = new Array();
allteam["danmai"]="丹麦";
allteam["wulagui"]="乌拉圭";
allteam["yilang"]="伊朗";
allteam["erluoshi"]="俄罗斯";
allteam["keluodya"]="克罗地亚";
allteam["bingdao"]="冰岛";
allteam["gelunbiya"]="哥伦比亚";
allteam["gesidalijia"]="哥斯达黎加";
allteam["aiji"]="埃及";
allteam["saierjiaer"]="塞内加尔";
allteam["saierweiya"]="塞尔维亚";
allteam["moxige"]="墨西哥";
allteam["niriliya"]="尼日利亚";
allteam["banama"]="巴拿马";
allteam["baxi"]="巴西";
allteam["deguo"]="德国";
allteam["moluoge"]="摩洛哥";
allteam["riben"]="日本";
allteam["bilishi"]="比利时";
allteam["shate"]="沙特";
allteam["faguo"]="法国";
allteam["bolan"]="波兰";
allteam["aodaliya"]="澳大利亚";
allteam["ruidian"]="瑞典";
allteam["ruishi"]="瑞士";
allteam["milu"]="秘鲁";
allteam["tunisi"]="	突尼斯";
allteam["yinggelan"]="英格兰";
allteam["putaoya"]="葡萄牙";
allteam["xibanya"]="西班牙";
allteam["agenting"]="阿根廷";
allteam["hanguo"] = "韩国";

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
            img.setAttribute('src', '../img/' + allteam[item.teamId] + ".png");
            div3.appendChild(img);
            div1.appendChild(div3);
            var div4 = document.createElement("div");
            div4.setAttribute('class', 'team-txt');
            div4.innerText = allteam[item.teamId];
            div1.appendChild(div4);
            var div5 = document.createElement("div");
            div5.setAttribute('class', 'team-num');
            div5.innerText = item.supportNum + " 支持";
            div1.appendChild(div5);
            $('.team-wrap').append(div1);
            index1++;
        }
        
    })
}

