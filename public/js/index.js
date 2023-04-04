document.addEventListener('DOMContentLoaded', function () {
    updateCardsLinks();
    fetchData();
}, false);

function updateCardsLinks() {
    document.getElementById("bsc-link").href = global_variables.BSC_EXPLORER + "/token/" + global_variables.BSC_CONTRACT;
    document.getElementById("neatio-link").href = global_variables.NEAT_SCANNER + "/address/" + global_variables.NEAT_ADDRESS;
}

function fetchData() {
    axios.get("/api/tokensupply")
        .then(function (response) {
            document.getElementById("total-bsc").innerHTML = (Number(response.data.result) / 1e18).toFixed(2) + " NEAT";
        })
        .catch(function (error) {
            console.log(error);
        });

    axios.get(`https://scan.neatio.net/api?module=account&action=balance&address=${global_variables.NEAT_ADDRESS}`)
        .then(function (response) {
            document.getElementById("total-neat").innerHTML = (Number(response.data.result) / 1e18).toFixed(2) + " NEAT";
        })

        .catch(function (error) {
            console.log(error);
        });
}