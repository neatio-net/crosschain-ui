const getLastItem = thePath => thePath.substring(thePath.lastIndexOf('/') + 1)
document.addEventListener('DOMContentLoaded', function () {
    fetchData();
}, false);


function fetchData() {
    axios.get('/api/info/' + getLastItem(window.location.pathname))
        .then(function (response) {
            window.amount = parseFloat(response.data.result.amount).toFixed(8);
            window.uuid = response.data.result.uuid;
            window.address = response.data.result.address;
            if (response.data.result.status == "Success") {
                document.getElementById("card-status").innerHTML = '<i class="fas fa-check-circle display-5 text-success"></i>' + '<p>Success</p>';
            } else if (response.data.result.status == "Pending") {
                document.getElementById("card-status").innerHTML = '<i class="far fa-clock display-5 text-warning"></i>' + '<p>Pending</p>';
            } else if (response.data.result.status == "Fail") {
                document.getElementById("card-status").innerHTML = `<i class="fas fa-exclamation-triangle display-5 text-danger"></i><p>Failed</p><p>Reason : ${response.data.result.fail_reason}</p>`;
            } else {
                document.getElementById("card-status").innerHTML = '<i class="fas fa-exclamation-triangle display-5 text-danger"></i>' + '<p>Unkhown state</p>';
            }
            document.getElementById("card-amount").innerHTML = parseFloat(response.data.result.amount).toFixed(8);

            if (response.data.result.fees) {
                document.getElementById("card-fees").innerHTML = '~ ' + (parseFloat(response.data.result.fees)).toFixed(3) + " NEAT";
            } else {
                if (response.data.result.type == 0) {
                    document.getElementById("card-fees").innerHTML = "<a href='#'onclick='calculateBSCFees();'>Calculate</a>";
                } else {
                    document.getElementById("card-fees").innerHTML = '~ ' + parseFloat(global_variables.NEAT_FIXED_FEE).toFixed(3) + " NEAT";

                }
            }

            document.getElementById("card-time").innerHTML = moment(response.data.result.time).local().format('YYYY.MM.DD hh:mm:ss A');
            if (response.data.result.address && response.data.result.type == 0) {
                document.getElementById("card-to").innerHTML = response.data.result.address.substring(0, 10) + "...." + response.data.result.address.substring(32, 42);
                document.getElementById("card-to").href = global_variables.BSC_EXPLORER + "/address/" + response.data.result.address;
            } else {
                document.getElementById("card-to").innerHTML = response.data.result.address.substring(0, 10) + "...." + response.data.result.address.substring(32, 42);
                document.getElementById("card-to").href = global_variables.NEAT_SCANNER + "/address/" + response.data.result.address;
            }
            document.getElementById("card-uuid").innerHTML = response.data.result.uuid;
            if (response.data.result.type == 0) {
                document.getElementById("card-type").innerHTML = 'NEATIO <i class="fas fa-angle-double-right"></i> BSC';
                document.getElementById("step1-title").innerHTML = "1. Send the required amount to the bridge's contract";
                document.getElementById("step2-title").innerHTML = "2. The bridge will mint $NEAT tokens on Binance Chain for your BSC address";
                document.getElementById("action-button").onclick = openNeatioApp;
                document.getElementById("action-button").innerHTML = "Send with Neatio App";
                if (response.data.result.neat_tx) {
                    document.getElementById("step1-bottom").innerHTML = `TxHash : <a href="${global_variables.NEAT_SCANNER + "/transaction/" + response.data.result.neat_tx}">${response.data.result.neat_tx.substring(0, 10)}...${response.data.result.neat_tx.substring(30, 42)}</a>`;
                    if (response.data.result.mined == 0) {
                        document.getElementById("step1-status").innerHTML = '<span class="text-warning">Mining</span>';
                    } else if (response.data.result.mined == 1) {
                        document.getElementById("step1-status").innerHTML = '<span class="text-success">Confirmed</span>';
                    } else if (response.data.result.mined == 2) {
                        document.getElementById("step1-status").innerHTML = '<span class="text-danger">Refused</span>';
                    } else {
                        document.getElementById("step1-status").innerHTML = '<span class="text-warning">Waiting</span>';
                    }
                    document.getElementById("card-buttons").classList.add("d-none");
                } else {
                    document.getElementById("step1-bottom").innerHTML = "";
                    document.getElementById("step1-status").innerHTML = '<span class="text-danger">Not Paid</span>';
                }
                if (response.data.result.bsc_tx) {
                    document.getElementById("step2-bottom").innerHTML = `TxHash : <a href="${global_variables.BSC_EXPLORER + "/tx/" + response.data.result.bsc_tx}">${response.data.result.bsc_tx.substring(0, 10)}...${response.data.result.bsc_tx.substring(30, 42)}</a>`;
                    document.getElementById("step2-status").innerHTML = '<span class="text-success">Sent</span>';

                } else {
                    document.getElementById("step2-bottom").innerHTML = "";
                    document.getElementById("step2-status").innerHTML = '<span class="text-warning">Pending</span>';
                }
            } else {
                document.getElementById("card-type").innerHTML = 'BSC <i class="fas fa-angle-double-right"></i> NEATIO';
                document.getElementById("step1-title").innerHTML = "1. Burn your tokens";
                document.getElementById("step2-title").innerHTML = "2. Native $NEAT will be sent to your wallet";
                document.getElementById("action-button").onclick = openMetamask;
                document.getElementById("action-button").innerHTML = "Open MetaMask";
                if (response.data.result.bsc_tx) {
                    document.getElementById("step1-bottom").innerHTML = `TxHash : <a href="${global_variables.BSC_EXPLORER + "/tx/"+ response.data.result.bsc_tx}">${response.data.result.bsc_tx.substring(0, 10)}...${response.data.result.bsc_tx.substring(30, 42)}</a>`;
                    if (response.data.result.mined == 0) {
                        document.getElementById("step1-status").innerHTML = '<span class="text-warning">Mining</span>';
                    } else if (response.data.result.mined == 1) {
                        document.getElementById("step1-status").innerHTML = '<span class="text-success">Confirmed</span>';
                    } else if (response.data.result.mined == 2) {
                        document.getElementById("step1-status").innerHTML = '<span class="text-danger">Refused</span>';
                    } else {
                        document.getElementById("step1-status").innerHTML = '<span class="text-warning">Waiting</span>';
                    }
                    document.getElementById("card-buttons").classList.add("d-none");
                } else {
                    document.getElementById("step1-bottom").innerHTML = "";
                    document.getElementById("step1-status").innerHTML = '<span class="text-warning">Pending</span>';
                }
                if (response.data.result.neat_tx) {
                    document.getElementById("step2-bottom").innerHTML = `TxHash : <a href="${global_variables.NEAT_SCANNER + "/transaction/"+response.data.result.neat_tx}">${response.data.result.neat_tx.substring(0, 10)}...${response.data.result.neat_tx.substring(30, 42)}</a>`;
                    document.getElementById("step2-status").innerHTML = '<span class="text-success">Sent</span>';
                } else {
                    document.getElementById("step2-bottom").innerHTML = "";
                    document.getElementById("step2-status").innerHTML = '<span class="text-warning">Pending</span>';
                }
            }
        })
        .catch(function (error) {
            toastr.error("Something went wrong.");
        });
}

function submitTx() {
    toastr.info("Submitting Tx..");
    axios.post('/api/assign', {
            uuid: window.uuid,
            tx: document.getElementById("modal-tx").value,
        })
        .then(function (response) {
            location.reload();
        }).catch(function (err) {
            toastr.error("Something went wrong.");
        });
}



async function calculateBSCFees() {

    try {
        document.getElementById("card-fees").innerHTML = "Loading";
        let resp = await axios.get("/api/calculateFees/" + getLastItem(window.location.pathname));
        if (resp.status == 200 && resp.data.result) {
            document.getElementById("card-fees").innerHTML = '~' + parseFloat(resp.data.result).toFixed(2) + " NEAT";
            return resp.data.result;
        } else {
            document.getElementById("card-fees").innerHTML = "Error";
        }
    } catch (error) {
        document.getElementById("card-fees").innerHTML = "Error";
        console.error(error);
    }
}
async function getNeatPrice() {
    const cpURL = "https://api.coinpaprika.com/v1/tickers/neat-neatio";
    await axios
      .get(cpURL)
      .then((response) => (this.priceUSD = response.data.quotes.USD.price));
}


async function openMetamask() {
    if (window.ethereum) {
        try {
            toastr.success("Openning Metamask");
            await ethereum.enable();
            let web3API = new Web3(window.ethereum);
            contract = new web3API.eth.Contract(contractABI, global_variables.BSC_CONTRACT);
            contract.methods.customBurn(web3API.utils.toWei(window.amount.toString()), window.address).send({
                from: await web3API.eth.getCoinbase()
            }, async function (err, result) {
                if (await result) {
                    console.log(result);
                    toastr.success("Submitting Tx");
                    axios.post('/api/assign', {
                            uuid: window.uuid,
                            tx: result
                        })
                        .then(function (response) {
                            if (response.status == 200) {
                                location.reload();
                            } else {
                                toastr.error("Something went wrong.");
                            }
                        }).catch(function (err) {
                            toastr.error("Something went wrong.");
                        });
                } else {
                    toastr.error(err);
                }

            });
        } catch (err) {
            console.log("erro");
            console.error(err);
        }
    }
}