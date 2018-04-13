const Assistant = require('watson-developer-cloud/assistant/v1');


async function createWorkspaces({
    url = 'https://gateway.watsonplatform.net/assistant/api/',
    username,
    password,
    version = '2018-02-16',
    workspaces
}) {
    if (!workspaces || (workspaces && !workspaces.length)) {
        return;
    }

    const assistant = getAssistant({
        username,
        password,
        url,
        version
    });

    await Promise.all(workspaces.map(async (wks) => {
        try {
            await createWorkspace({
                assistant,
                name: wks.name,
                description: wks.description || '',
                language: wks.language || 'en'
            })
        } catch (err) {
            console.err(err)
        }
    }));
}

async function deleteWorkspaces({
    url = 'https://gateway.watsonplatform.net/assistant/api/',
    username,
    password,
    version = '2018-02-16',
}) {
    const assistant = getAssistant({
        username,
        password,
        url,
        version
    });

    const workspaces = await listWorkspaces({ assistant });

    await Promise.all(workspaces.map(async (wks) => {
        try {
            await deleteWorkspace({
                assistant,
                id: wks.workspace_id
            })
        } catch (err) {
            console.err(err)
        }
    }));
}


async function createWorkspace({ assistant, name, description, language }) {
    return new Promise((resolve, reject) => {
        const workspace = { name, description, language };

        assistant.createWorkspace(workspace, function (err, response) {
            if (err) {
                console.error(err);
                return reject(err);
            } else {
                console.log(JSON.stringify(response, null, 2));
                return resolve(response);
            }
        });
    });
}

async function listWorkspaces({ assistant }) {
    return new Promise((resolve, reject) => {
        assistant.listWorkspaces(function (err, response) {
            if (err) {
                console.error(err);
                return reject(err);
            } else {
                return resolve(response.workspaces);
            }
        });
    });
}

async function deleteWorkspace({ assistant, id }) {
    return new Promise((resolve, reject) => {
        assistant.deleteWorkspace({ workspace_id: id }, function (err, response) {
            if (err) {
                console.error(err);
                return reject(err);
            } else {
                return resolve(response.workspaces);
            }
        });
    });
}

function getAssistant({
    username,
    password,
    url,
    version
}) {
    return assistant = new Assistant({
        username,
        password,
        url,
        version
    });
}

module.exports = {
    createWorkspaces,
    deleteWorkspaces
};