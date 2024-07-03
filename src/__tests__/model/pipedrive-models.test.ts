require('@configs/env.config')('test');
import Database from '@src/database';

const connection = new Database().sequelize;

// Tests are the bare minimum to check if the models are working as expected
// TODO: Add more tests to check if the models are working as expected (hooks, constraints, cascade, etc)
describe.skip('It should be able to create different models data', () => {
  beforeAll((done) => {
    const opening = Promise.all([connection.authenticate()]);

    opening
      .then(async () => {
        await connection.sync({ force: true });
        done();
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  });

  afterAll((done) => {
    const closing = Promise.all([connection.close()]);
    closing.then(() => done());
  });

  it('It should be able to create a user', async () => {
    // const t = await connection.transaction();
    // try {
    //   const person = await PipedrivePerson.create(
    //     {
    //       pipedrive_id: 1,
    //       name: 'Mathieu Lussier',
    //       first_name: 'Mathieu',
    //       last_name: 'Lussier',
    //       function: 'Developer',
    //       infos: [
    //         { label: 'email', value: 'mathieu@x-trait.com', primary: true },
    //         { label: 'phone', value: '+14388894324', primary: true },
    //       ],
    //     },
    //     { include: [PipedrivePersonInfos], transaction: t }
    //   );
    //   expect(person).toHaveProperty('id');
    //   expect(person).toHaveProperty('first_name', 'Mathieu');
    //   expect(person).toHaveProperty('last_name', 'Lussier');
    //   expect(person).toHaveProperty('name', 'Mathieu Lussier');
    //   expect(person).toHaveProperty('function', 'Developer');
    //   expect(person.infos).toHaveLength(2);
    //   expect(person.infos && person.infos[0]).toHaveProperty('label', 'email');
    //   expect(person.infos && person.infos[0]).toHaveProperty(
    //     'value',
    //     'mathieu@x-trait.com'
    //   );
    //   expect(person.infos && person.infos[0]).toHaveProperty('primary', true);
    //   expect(person.infos && person.infos[1]).toHaveProperty('label', 'phone');
    //   expect(person.infos && person.infos[1]).toHaveProperty(
    //     'value',
    //     '+14388894324'
    //   );
    //   expect(person.infos && person.infos[1]).toHaveProperty('primary', true);
    //   await t.commit();
    // } catch (error) {
    //   console.error(error);
    //   await t.rollback();
    //   throw error;
    // }
  });
});
