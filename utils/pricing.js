const pricing = {
    Micro: { base: 40, perKm: 10, perMin: 2 },
    Sedan: { base: 60, perKm: 13, perMin: 3 },
    SUV: { base: 80, perKm: 16, perMin: 4 }
};

export function calculateFare(type, km, minutes) {
    const p = pricing[type];

    if (!p) throw new Error("Invalid car type");

    return Math.round(
        p.base +
        (km * p.perKm) +
        (minutes * p.perMin)
    );
}

export function calculateAllFares(km, minutes) {
    return {
        Micro: calculateFare("Micro", km, minutes),
        Sedan: calculateFare("Sedan", km, minutes),
        SUV: calculateFare("SUV", km, minutes),
    };
}