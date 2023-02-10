let halo = {
    darkComment : ()=>{
        if(document.querySelector('#comment div').shadowRoot.querySelector('.halo-comment-widget').classList != null){
            let commentDOMclass =  document.querySelector('#comment div').shadowRoot.querySelector('.halo-comment-widget').classList
            if(commentDOMclass.contains('light'))
                commentDOMclass.replace('light','dark')
            else
            commentDOMclass.replace('dark','light')
        }
           
    }
}