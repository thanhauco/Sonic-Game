(function() {
    const WIDGET_URL = 'http://localhost:3000';
    
    function init() {
        const container = document.createElement('div');
        container.id = 'jordan-agents-widget';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '9999';
        
        const button = document.createElement('button');
        button.innerHTML = '💬';
        button.style.width = '60px';
        button.style.height = '60px';
        button.style.borderRadius = '50%';
        button.style.background = '#6366f1';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.fontSize = '24px';
        button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        
        button.onclick = () => {
            const iframe = document.getElementById('jordan-agents-iframe');
            if (iframe) {
                iframe.style.display = iframe.style.display === 'none' ? 'block' : 'none';
            } else {
                const newIframe = document.createElement('iframe');
                newIframe.id = 'jordan-agents-iframe';
                newIframe.src = WIDGET_URL;
                newIframe.style.position = 'fixed';
                newIframe.style.bottom = '90px';
                newIframe.style.right = '20px';
                newIframe.style.width = '400px';
                newIframe.style.height = '600px';
                newIframe.style.border = 'none';
                newIframe.style.borderRadius = '16px';
                newIframe.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
                container.appendChild(newIframe);
            }
        };
        
        container.appendChild(button);
        document.body.appendChild(container);
    }
    
    if (document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();
