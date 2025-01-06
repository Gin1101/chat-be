const paginationQuery = async ({ model, conditions = {}, sort, options = [], page = 1, size = 20, facet }) => {
    const dataOptions = [{ $skip: (page - 1) * size }, { $limit: size }];
    let facetOptions = {
        total: [{ $count: 'total' }],
        data: dataOptions,
    };
    if (facet) {
        facetOptions = {
            ...facetOptions,
            ...facet
        }
    }
    let pipeline = []
    conditions ? pipeline.push({ $match: conditions }) : null;
    sort ? pipeline.push({ $sort: sort }) : null;
    pipeline = [
        ...pipeline,
        ...options.filter(op => op),
        {
            $facet: facetOptions
        }
    ]
    let [data] = await model.aggregate(pipeline);
    data = { ...data, total: data.total[0]?.total || 0 };
    return data;
};

const deepMerge = (obj, path, value) => {
    var keys = Array.isArray(path) ? path : path.split('.');
    for (var i = 0; i < keys.length - 1; i++) {
        var key = keys[i];
        if (!obj.hasOwnProperty(key)) obj[key] = {};
        obj = obj[key];
    }
    if (typeof obj[keys[i]] === 'object' && typeof value === 'object') {
        obj[keys[i]] = { ...obj[keys[i]], ...value }
    } else {
        obj[keys[i]] = value
    }
    return value;
}

const filterCreator = (pathValuesPairArr, deep = true) => {
    let result = {};
    pathValuesPairArr.reduce((prev, curr) => {
        if (curr) {
            const [path, value] = curr;
            if (deep) {
                deepMerge(prev, path, value)
            }
            else {
                prev[path] = value;
            }
        }
        return prev;
    }, result)
    return result;
}

export {
    paginationQuery,
    filterCreator
}