let counter = 1;

export const v4 = jest.fn(() => {
    const paddedCounter = counter.toString().padStart(12, '0');
    counter++;
    return `00000000-0000-0000-0000-${paddedCounter}`;
});

export const resetCounter = () => {
    counter = 1;
};