const carList = [
    {
        id: '12345',
        name: 'pajero',
        year: 2005,
        createdAt: 12345,
        updatedAt: 12345,
    },
    {
        id: '12346',
        name: 'mercedes',
        year: 2006,
        createdAt: 12345,
        updatedAt: 12345,
    },
    {
        id: '12347',
        name: 'toyota',
        year: 2007,
        createdAt: 12345,
        updatedAt: 12345,
    },
];

const carMapped = carList.map((car) => {
    return {
        name: car.name,
        year: car.year,
    };
});

const response = {
    status: 'success',
    data: {
        cars: carMapped,
    },
};


const getAllNotes = (name) => {
    let cars;
    if (name) {
        cars = carList.filter((b) => b.name == name);
        return cars;
    }
    return carList;
};

console.log(getAllNotes());
console.log();
console.log(getAllNotes('pajero'));
