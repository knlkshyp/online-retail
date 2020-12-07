async function getData(url, field, id) {
    const element = document.getElementById(id);
    if (element !== null) {
        const response = await fetch(`/${url}`, {
            method: 'GET'
        });
        const json = await response.json();
        for (index = 0; index < json.length; index++) {
            const option = document.createElement('OPTION');
            option.text = json[index][`${field}`];
            element.add(option);
        }
    }
}

getData("empCodes", "employeeCode", "empCode");
getData("distrib", "distribCode", "distribCode");
getData("product", "name", "productList");