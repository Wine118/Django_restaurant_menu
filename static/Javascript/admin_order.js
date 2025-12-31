document.addEventListener("click", function (e) {
    if (e.target.matches(".pagination button")) {
        const page = e.target.dataset.page;
        const date = document.getElementById("select_date").querySelector("input[name=date]").value;

        fetch(`/cafedashboard/cafeorders/?page=${page}&date=${date}`)
            .then(response => response.text())
            .then(html => {
                //Replace only the table
                const parser = new DOMParser();
                const doc = parser.parseFromString(html,"text/html");
                const table = doc.querySelector("#orders-container");
                document.getElementById("orders-container").innerHTML = table.innerHTML;             
            });
    }
});



document.addEventListener("change", function(e){
    if(e.target.matches(".processed-checkbox")){
        
        const orderId = e.target.dataset.id;
        const isProcessed = e.target.checked;
        console.log("processed checkbox is clicked");
        console.log(`order id is ${orderId} and Processed is ${isProcessed}`);

        fetch(`/menu/toggle-processed/`,{
            method:"POST",
            headers:{
                "Content-type":"application/json",
                "X-CSRFToken":getCSRFToken()
            },
            body: JSON.stringify({
                id: orderId,
                processed: isProcessed
            })
        }).then(res => res.json())
          .then(data => console.log(data));
    }

    if(e.target.matches(".phoned-checkbox")){
        const orderId = e.target.dataset.id;
        const isPhoned = e.target.checked;

        console.log("phone checkbox is clicked");
        console.log(`order id is ${orderId} and Processed is ${isPhoned}`);

        fetch(`/menu/toggle-phoned/`,{
            method:"POST",
            headers:{
                "Content-type":"application/json",
                "X-CSRFToken":getCSRFToken()
            },
            body: JSON.stringify({
                id: orderId,
                phoned: isPhoned,
            })
        }).then(res => res.json())
          .then(data => console.log(data));
    }
});


function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}