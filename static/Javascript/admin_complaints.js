document.addEventListener("click", function (e) {
    if (e.target.matches(".pagination button")) {
        const page = e.target.dataset.page;
        const date = document.getElementById("select_date").querySelector("input[name=date]").value;

        fetch(`/cafedashboard/cafecomplaints/?page=${page}&date=${date}`)
            .then(response => response.text())
            .then(html => {
                //Replace only the table
                const parser = new DOMParser();
                const doc = parser.parseFromString(html,"text/html");
                const table = doc.querySelector("#complaints-container");
                document.getElementById("complaints-container").innerHTML = table.innerHTML;             
            });
    }
});

function getCSRFToken() {
    return document.querySelector('[name=csrfmiddlewaretoken]').value;
}

document.addEventListener("change", function(e){
    if (e.target.matches(".read-checkbox")) {
        const complaintId = e.target.dataset.id;
        const isRead = e.target.checked;

        fetch(`/complaints/toggle-read/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCSRFToken()
            },
            body: JSON.stringify({
                id: complaintId,
                read: isRead
            })
        }).then(res => res.json())
          .then(data => console.log(data));
    }
});