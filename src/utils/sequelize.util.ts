export type FindOrCreateOptions = {
  where: any;
  defaults?: any;
  transaction?: any;
};

export async function findOrCreateAndUpdate(
  model,
  options: FindOrCreateOptions
) {
  const [instance, created] = await model.findOrCreate(options);

  if (!created) {
    await instance.update(options.defaults);
  }

  return instance;
}

export default {
  findOrCreateAndUpdate,
};
