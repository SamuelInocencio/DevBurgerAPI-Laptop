import * as Yup from 'yup';

import Product from '../models/Product';
// import User from '../models/User';

class ProductController {
  async store(request, response) {
    const schema = Yup.object({
      name: Yup.string().required(),
      price: Yup.number().required(),
      category: Yup.string().required(),
      offer: Yup.boolean(),
    });

    try {
      schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    // const { admin: isAdmin } = await User.findByPk(request.userId);

    // if (!isAdmin) {
    //   return response.status(401).json();
    // }

    const { filename: path } = request.file;
    const { name, price, category, offer } = request.body;

    const product = await Product.create({
      name,
      price,
      category,
      path,
      // offer,
    });

    return response.status(201).json(product);
  }

  async index(request, response) {
    const products = await Product.findAll({
      // include: [
      //   {
      //     model: Category,
      //     as: 'category',
      //     attributes: ['id', 'name'],
      //   },
      // ],
    });

    return response.json(products);
  }
}

export default new ProductController();
