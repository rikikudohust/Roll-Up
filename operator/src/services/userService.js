async function getInformationFromIndex(id) {

    return {
        "a" : 5,
        "b" : 10
    }
} 

async function getInformationFromAddress(address) {
    return {
        "address": address,
        "message": "Hellow"
    }
}

module.exports = {
    getInformationFromAddress,
    getInformationFromIndex
}