const button = document.querySelector('.button')
const tokenField = document.getElementById('token')
const channelField = document.getElementById('channel')
const delayField = document.getElementById('delay')
const checkBoxDelete = document.getElementById('delete')
const timer = document.getElementById('timer')
const msgStatus = document.getElementById('msg-status')
const buttonStop = document.getElementById('stop-farmer')

let started = false

tokenField.value = localStorage.token
channelField.value = localStorage.channelId
delayField.value = localStorage.delay
checkBoxDelete.checked = eval(localStorage.toDelete)

let token = ''
let channelId = ''
let delay = 5
let toDelete = false
let counter = 0

const deleteMessage = (token, channel, messageId) => {
    const url = `https://discord.com/api/v8/channels/${channel}/messages/${messageId}`

    fetch(url, {
        method: 'DELETE',
        headers: {
            "authorization": token
        }
    })
}

const sendMessage = async (token, channel, toDelete) => {
    const url = `https://discord.com/api/v8/channels/${channel}/messages`

    request = new XMLHttpRequest();
    request.withCredentials = true;
    request.open("POST", url);
    request.setRequestHeader("authorization", token);
    request.setRequestHeader("accept", "/");
    request.setRequestHeader("authority", "discord.com");
    request.setRequestHeader("content-type", "application/json");

    request.onload = () => {
        const id = JSON.parse(request.response)['id']
        counter += 1
        timer.innerText = `Messages sent: ${counter}`
        if (toDelete) {
            deleteMessage(token, channel, id)
        }
    }

    request.send(JSON.stringify({ 
        content: `${Math.random()}` 
    }));
}

const startFarmer = (token, channel, delay, toDelete) => {
    msgStatus.style.color = 'green'
    msgStatus.innerText = 'running true'

    const sendingInterval = setInterval(() => {
        sendMessage(token, channel, toDelete)
    }, delay * 1000)

    buttonStop.addEventListener('click', () => {
        clearInterval(sendingInterval)
        msgStatus.style.color = 'red'
        msgStatus.innerText = 'running false'
    })
}

const form = document.getElementById('form')

form.addEventListener('submit', event => {
    event.preventDefault()

    const data = new FormData(form);

    for (const [name, value] of data) {
        if (name === 'token') {
            token = value
        } else if (name === 'channel') {
            channelId = value
        } else if (name === 'delay') {
            delay = parseInt(value)
            if (isNaN(delay) && delay < 1) {
                delay = 5
            }
        } else if (name === 'delete') {
            toDelete = true
        }
    }

    if (token && channelId && delay && !started) {
        started = true
        localStorage.setItem('token', token)
        localStorage.setItem('channelId', channelId)
        localStorage.setItem('delay', delay)
        localStorage.setItem('toDelete', toDelete)

        startFarmer(token, channelId, delay, toDelete)
    }
})