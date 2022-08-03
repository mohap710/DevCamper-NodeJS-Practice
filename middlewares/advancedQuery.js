export const advancedQuery = (model, populate) => async (request, response, next) => {
  let query;

  // make copy of request.query
  const reqQuery = { ...request.query };
  // Params to exclude
  const excludeParams = ["select", "sort", "limit", "page"];
  excludeParams.forEach((param) => delete reqQuery[param]);

  // create Mongoose Operators ( $gt|$gte|$lt|$lte|$in )
  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Find Resources
  query = model.find(JSON.parse(queryStr))

  // Select Fields
  if (request.query.select) {
    // transform Field from comma seprated to space seprated
    // e.g: name,desc,created => name desc created
    let fields = request.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort By field or Default Sort by createdAt
  if (request.query.sort) {
    let sortBy = request.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }

  // Pagination
  const page = parseInt(request.query.page, 10) || 1;
  const limit = parseInt(request.query.limit, 10) || 10;
  const firstIndex = (page - 1) * limit;
  let lastIndex = page * limit;
  const total = await model.countDocuments();

  query = query.skip(firstIndex).limit(limit);
  const pagination = {};
  if (lastIndex > total) {
    lastIndex = total;
  }
  pagination.perPage = `Showing Data from ${firstIndex + 1} to ${lastIndex}`;
  if (firstIndex > 0) {
    pagination.prevPage = page - 1;
  }
  if (lastIndex < total) {
    pagination.nextPage = page + 1;
  }
  if(populate){
    query = query.populate(populate)
  }
  const result = await query;

  response.queryResult = {
    success: true,
    count: total,
    pagination,
    data: result,
  };
  next();
};
