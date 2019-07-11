<docs>
    UNIChat消息输入框
</docs>

<template>
    <div class="textarea-wraper">
        <div class="textarea-wraper">
            <textarea ref="chatareaEle" class="textarea" @keydown.prevent.enter="sendMessage" v-model="message"></textarea>
        </div>
        <div class="preview" v-show="previewObj.src">
            <div class="preview-wrapper">
                <p class="preview-title">发送图片</p>
                <div class="preview-box">
                    <img class="preview-img" ref="previewEle" :src="previewObj.src" alt="">
                    <p class="preview-name">{{ previewObj.name }}</p>
                    <p class="preview-size">{{ previewObj.size|thoudsand }} KB</p>
                </div>
                <div class="preview-ctrl">
                    <button class="preview-btn preview-cancel" @click="clearPreview">取消</button>
                    <button class="preview-btn preview-submit">发送</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import * as R from 'ramda'
export default {
    filters: {
        thoudsand (val) {
            return (val / 1000).toFixed(2)
        }
    },
    data () {
        return {
            message: '',
            socket: null,
            previewObj: {
                src: null,
                name: null,
                size: 0
            }
        }
    },

    computed: {
        friendId () {
            return this.$route.params.uid
        },

        user () {
            return this.$store.getters.user.uid
        }
    },

    methods: {
        sendMessage (evt) {
            const message = this.message
            const to = this.friendId
            const from = this.user
            const msg = {
                type: 1,
                info: {
                    message,
                    datetime: new Date().getTime()
                }
            }
            this.updateMessages(msg) // 更新消息队列
            this.socket.send(JSON.stringify({
                from,
                to,
                message
            }))
            this.clearMessage()
        },
        clearMessage () {
            this.message = ''
        },
        updateMessages (msg) {
            const messages = this.$store.getters.messages || []
            const msgs = R.append(msg)(messages)
            const getDateTime = R.compose(R.prop('datetime'), R.prop('info'))
            // 按照datetime属性排序
            this.$store.commit('setMessage', R.sortBy(getDateTime)(msgs))
        },
        initPaste () {
            const $chatEle = this.$refs.chatareaEle
            $chatEle.addEventListener('paste', (e) => {
                const clipboardData = e.clipboardData || window.clipboardData
                console.log(clipboardData.files[0])
                const transferItems = Object.values(clipboardData.items)
                if(transferItems.length) {
                    transferItems.forEach(each => {
                        if(each.kind === 'string') return
                        const file = each.getAsFile()
                        const { name, size } = file
                        const url = URL.createObjectURL(file)
                        this.previewObj = {
                            name,
                            size,
                            src: url
                        }

                        // this.$refs.previewEle.onload = function(){
                        //     console.log(this.src)
                        //     URL.revokeObjectURL(this.src)
                        // }

                        /* base64预览
                        const reader = new FileReader()
                        reader.addEventListener("load", () => {
                            this.previewObj = {
                                name,
                                size,
                                src: reader.result
                            }
                        }, false)
                        reader.readAsDataURL(file) */
                    })
                }
            },{
                capture: false,
                passive: false
            })
        },
        clearPreview () {
            this.previewObj = {
                src: null,
                name: null,
                size: null
            }
        },
        initDrag () {
            const $chatEle = this.$refs.chatareaEle
            const img = new Image()
            img.src = '/img/jn.jpg'
            document.addEventListener('dragstart', (e) => {
                console.log('dragstart')
                e.dataTransfer.setDragImage(img, 50, 50)
                // e.dataTransfer.effectAllowed = 'all'
            }, {
                capture: false,
                passive: false
            })

            $chatEle.addEventListener('dragenter', (e) => {
                // e.preventDefault()
                console.log('dragenter')
            }, {
                capture: false,
                passive: false
            })

            $chatEle.addEventListener('dragover', (e) => {
                e.preventDefault()
                e.dataTransfer.dropEffect = 'link'
                console.log('dragover')
            }, {
                capture: false,
                passive: false
            })
            $chatEle.addEventListener('dragleave', (e) => {
                // e.preventDefault()
                console.log('dragleave')
            }, {
                capture: false,
                passive: false
            })
            $chatEle.addEventListener('drop', (e) => {
                console.log('drop')
                e.preventDefault()
                console.log(e.dataTransfer.getData('text'))
                const files = e.dataTransfer.files || []
                if(files.length) {
                    const { name, size } = files[0]
                    const url = URL.createObjectURL(files[0])
                    this.previewObj = {
                        name,
                        size,
                        src: url
                    }
                } else {
                    const transferItems = e.dataTransfer.items
                    if(transferItems.length && transferItems[0].kind === 'string') {
                        transferItems[0].getAsString(s => console.log(s))
                    } else {
                        //
                    }
                } 
            }, {
                capture: false,
                passive: false
            })
            document.addEventListener('dragend', (e) => {
                // e.preventDefault()
                console.log('dragend')
            }, {
                capture: false,
                passive: false
            })
            
        }
    },

    mounted () {
        this.initPaste()
        this.initDrag()
    },

    created () {
        this.socket = new WebSocket(`ws://localhost:8081/chat/single_chat?uid=${this.user}`)

        this.socket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data)
            const msg = {
                type: -1,
                info: {
                    datetime: new Date().getTime(),
                    message: data.message,
                    name: data.name
                }
            }
            this.updateMessages(msg)
        })
    }
}
</script>


<style lang="scss" scoped>
    .textarea-wraper{
        width: 100%;
        height: 100%;
    }
    .textarea{
        width: 100%;
        height: 100%;
        background: none;
    }
    .preview{
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        z-index: 1;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.7);

        &-wrapper{
            display: flex;
            flex-direction: column;
            width: 420px;
            height: auto;
            padding: 10px 0;
            background-color: #fff;
            border-radius: 4px;
        }

        &-title{
            padding: 10px 0;
            text-align: center;
            font-size: 16px;
            color: #333;
        }

        &-box{
            display: flex;
            flex-direction: column;
            padding: 10px 20px;
            background-color: #EFEFEF;
        }

        &-img{
            width: 100%;
            height: auto;
            max-height: 300px;
            overflow: hidden;
        }

        &-name{
            margin: 20px 0 10px;
            text-align: center;
            font-size: 14px;
            color: #333333;
        }

        &-size{
            font-size: 14px;
            text-align: center;
            color: #a1a499;
        }

        &-ctrl{
            margin: 10px 0;
            text-align: center;
        }

        &-btn{
            width: 100px;
            height: 34px;
            border-radius: 4px;
            line-height: 34px;
            font-size: 14px;
            cursor: pointer;
            outline: none;
            border: none;
            letter-spacing: 3px;
        }

        &-cancel{
            color: #333;
            background-color: #dddfe6 ;
        }

        &-submit{
            margin-left: 50px;
            color: #fff;
            background-color: #62B87A ;
            &:hover{
                background-color: #6abe83;
            }
        }
    }
</style>
