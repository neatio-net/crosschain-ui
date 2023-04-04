document.addEventListener('DOMContentLoaded', function () {
    fetchData();
}, false);


function fetchData() {
    var newEntry
    axios.get('/api/latest')
        .then(function (response) {
            response.data.result.forEach(element => {
                newEntry = "";
                if (element.status == "Success") {
                    newEntry += `<td><span class="badge bg-success">Success</span></td>`;
                } else if (element.status == "Pending") {
                    newEntry += `<td><span class="badge bg-warning">Waiting for payment</span></td>`;
                } else if (element.status == "Fail") {
                    newEntry += `<td><span class="badge bg-danger">Canceled by user</span></td>`;
                }
                if (element.type == 0) {
                    newEntry += '<td> <img src="/images/neat.png" style="height:20px;" class="mb-1 mr-2 ml-2"> <i class="fas fa-angle-right"> </i> <img src="/images/bsc.png" style="height:20px;" class="mb-1 mr-2 ml-2"></td>';
                } else {
                    newEntry += '<td><img src="/images/bsc.png" style="height:20px;" class="mb-1 mr-2 ml-2"> <i class="fas fa-angle-right"></i> <img src="/images/neat.png" style="height:20px;" class="mb-1 mr-2 ml-2"></td>';
                }
                newEntry += `<td>${element.address}</td>`;
                newEntry += `<td>${parseFloat(element.amount).toFixed(6)} NEAT</td>`;
                newEntry += `<td>${moment(element.time).local().format('YYYY.MM.DD hh:mm A')}</td></tr>`;
                document.getElementById("txs-table").innerHTML += newEntry;
            });
        })
        .catch(function (error) {
            console.log(error);
        });
}