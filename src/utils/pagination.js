export const paigination = (page,size) => {
    if (page <= 0 || !page) page = 1;
    if (size <= 0 || !size) size = 10;
    const skip = size * (page - 1);
    return { skip , limit: size };
};
