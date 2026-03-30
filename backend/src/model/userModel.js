import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

const filepath = path.join(_dirname, '../../databases/users.json');



export function getUsers() { //lê os dados do meu json
    return JSON.parse(fs.readFileSync(filepath));
}

export function createUsers(user) {
    const data = getUsers();

    const newUser = {
        id: Date.now(),
        ...user
    };

    data.push(newUser);

    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));

    return  newUser;
}
