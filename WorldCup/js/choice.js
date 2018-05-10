
//var dappAddress = "n1fvAdUKi1qK8gowLCEj5kAGK7QzgFSo4p9";
var dappAddress = "n1y4pC21TfewQhYkQNkeq3ZKbdyyTSvM2rK";

document.addEventListener("DOMContentLoaded", function () {
    console.log("web page loaded...")
    $("#noExtension").hide();
    $("#btnchoice1").hide();
    $("#btnchoice2").show();
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
            if (result.method == 'who_supporter') {
                if (result.supporterVoteItem != null && result.supporterVoteItem != '' && result.supporterVoteItem.teamIds.length > 0) {
                    $("#btnchoice1").hide();
                    $("#btnchoice2").show();
                    return;
                }
            }

           
        }
        else {
            alert(execute_err);
        }

        $("#btnchoice1").show();
        $("#btnchoice2").hide();

    }
});

function checkNebpay() {
    console.log("check nebpay")
    try {
        var NebPay = require("nebpay");
        if (NebPay === "null" || NebPay === "undefined") {
            //引入API
            var NebPay = require("nebpay");
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
    var func = "who_supporter"
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



$(function () {


    
    var selectteamid = '';
	//选择球队
	$(".team-li").on("click" , function () {
		var _txt = $(this).find("p").text();
		$(".ch-title span").text(_txt);
		selectteamid = $(this).find("input").val();
		$(".team-li").removeClass("team-this");
		$(this).addClass("team-this");
	});
	
	//投下我的选择
	$("#btnchoice1").on("click", function () {
	    if (selectteamid == '')
	    {
	        alert("请选择球队");
	        return;
	    }

	    var func = "vote"
	    var args = "[\"" + GetLocalIPAddress() + "\",\"" + selectteamid + "\"]"

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
	        "method": "neb_sendTransaction"
	    }, "*");
	    window.location.href = "result.html";
	});

	$("#btnchoice2").on("click", function () {
	    window.location.href = "result.html";
	});

    //登记球队
	$("#btnteamid").click(function () {
	    if (selectteamid == '') {
	        alert("请选择球队");
	        return;
	    }

	    console.log("********* call smart contract \"sendTransaction\" *****************")
	    var func = "launch"
	    var args = "[\"" + GetLocalIPAddress() + "\",\"" + selectteamid + "\"]"

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
	        "method": "neb_sendTransaction"
	    }, "*");
	});

        function GetLocalIPAddress() {
            var obj = null;
            var rslt = "";
            try {
                obj = new ActiveXObject("rcbdyctl.Setting");
                rslt = obj.GetIPAddress;
                obj = null;
            }
            catch (e) {
                //异常发生
                rslt = '127.0.0.1';
            }
            return rslt;
        };
});
