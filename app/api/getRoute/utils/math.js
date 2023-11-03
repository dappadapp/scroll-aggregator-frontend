const approximatelyEqual = (numberOne, numberTwo, epsilon = 0.001) => {
    // console.log(numberOne, numberTwo);
    return Math.abs(numberOne - numberTwo) < epsilon;
};

module.exports = { approximatelyEqual };