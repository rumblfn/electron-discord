const button = document.querySelector('.button')
const tokenField = document.getElementById('token')
const channelField = document.getElementById('channel')
const delayField = document.getElementById('delay')
const checkBoxDelete = document.getElementById('delete')
const timer = document.getElementById('timer')
const msgStatus = document.getElementById('msg-status')
const buttonStop = document.getElementById('stop-farmer')

var started = false

tokenField.value = localStorage.token
channelField.value = localStorage.channelId
delayField.value = localStorage.delay
checkBoxDelete.checked = eval(localStorage.toDelete)

var token = ''
var channelId = ''
var delay = 5000
var autoDelay = 100
var toDelete = false
var counter = 0

buttonStop.addEventListener('click', (e) => {
    e.preventDefault()
    msgStatus.style.color = 'red'
    msgStatus.innerText = 'running false'
    started = false
})

const deleteMessage = async (messageId) => {
    const url = `https://discord.com/api/v8/channels/${channelId}/messages/${messageId}`

    await fetch(url, {
        method: 'DELETE',
        headers: {
            "authorization": token
        }
    })

    setTimeout(() => {
        sendMessage()
    }, delay)
}

const sendMessage = async () => {
    if (!started) {
        return null
    }

    const url = `https://discord.com/api/v8/channels/${channelId}/messages`

    request = new XMLHttpRequest();
    request.withCredentials = true;
    request.open("POST", url);
    request.setRequestHeader("authorization", token);
    request.setRequestHeader("accept", "/");
    request.setRequestHeader("authority", "discord.com");
    request.setRequestHeader("content-type", "application/json");

    request.onload = () => {
        const messageId = JSON.parse(request.response)['id']
        counter += 1
        timer.innerText = `Messages sent: ${counter}`

        if (toDelete) {
            deleteMessage(messageId)
        } else {
            setTimeout(() => {
                sendMessage()
            }, delay)
        }
    }

    request.send(JSON.stringify({ 
        content: `${Math.random()}` 
    }));
}

const startFarmer = () => {
    msgStatus.style.color = 'green'
    msgStatus.innerText = 'running true'

    sendMessage()
}

const form = document.getElementById('form')

form.addEventListener('submit', event => {
    event.preventDefault()

    const data = new FormData(form);
    toDelete = false

    for (const [name, value] of data) {
        if (name === 'token') {
            token = value
        } else if (name === 'channel') {
            channelId = value
        } else if (name === 'delay') {
            delay = parseInt(value)
            console.log(delay)
            if (isNaN(delay) || delay < 100) {
                delay = 5000
            }
        } else if (name === 'delete' && value === 'on') {
            console.log(name, value)
            toDelete = true
        }
    }

    if (token && channelId && delay && !started) {
        started = true
        localStorage.setItem('token', token)
        localStorage.setItem('channelId', channelId)
        localStorage.setItem('delay', delay)
        localStorage.setItem('toDelete', toDelete)

        startFarmer()
    }
})