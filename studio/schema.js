import createSchema from 'part:@sanity/base/schema-creator';
import schemaTypes from 'all:part:@sanity/base/schema-type';
import post from './schemas/post';
import author from './schemas/author';

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([post, author]),
});
