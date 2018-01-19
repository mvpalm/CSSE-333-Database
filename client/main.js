$(document).ready(function () {
    
    function clicker() {
        $.ajax({
            url: "http://localhost:5000/api/inventory/add",
            data: {
                "name": "UTF8",
                "price": 32,
                "description": "good",
                "qty": 5
            },
            success: function (result) {
                console.log(results);
            }
        });
    };
});