import { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';

export type Middleware = (req: NextApiRequest, res: NextApiResponse, next: () => void) => void;

export const withFilterSortPagination: Middleware = (req, res, next) => {
  /* FILTERING & SEARCHING & SORTING & PAGINATION */

  // ### FILTERING ###
  const filter = req.query?.filter || {};

  // ### SEARCHING ###
  const search = req.query?.search || {};
  for (let key in search) search[key] = { $regex: search[key], $options: 'i' };

  // ### SORTING ###
  const sort = req.query?.sort || {};

  // ### PAGINATION ###
  let limit = Number(req.query?.limit);
  limit = limit > 0 ? limit : Number(process.env.PAGE_SIZE || 20);

  let page = Number(req.query?.page);
  page = page > 0 ? page - 1 : 0;

  let skip = Number(req.query?.skip);
  skip = skip > 0 ? skip : page * limit;

  /* FILTERING & SEARCHING & SORTING & PAGINATION */

  // Add methods to the response object for reuse in routes:
  res.getModelList = async (Model: mongoose.Model<any>, customFilter = {}, populate = null) => {
    return await Model.find({ ...filter, ...search, ...customFilter }).sort(sort).skip(skip).limit(limit).populate(populate);
  };

  // Get details like pagination and total records
  res.getModelListDetails = async (Model: mongoose.Model<any>, customFilter = {}) => {
    const data = await Model.find({ ...filter, ...search, ...customFilter });

    let details = {
      filter,
      search,
      sort,
      skip,
      limit,
      page,
      pages: {
        previous: page > 0 ? page : false,
        current: page + 1,
        next: page + 2,
        total: Math.ceil(data.length / limit)
      },
      totalRecords: data.length,
    };
    details.pages.next = details.pages.next > details.pages.total ? false : details.pages.next;
    if (details.totalRecords <= limit) details.pages = false;
    return details;
  };

  next();
};
