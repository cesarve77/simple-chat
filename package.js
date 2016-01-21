Package.describe({
    summary: "Simple chat windows. The star point to make your own chat",
    version: "0.1.0",
    name: "cesarve:simple-chat",
    git: "https://github.com/cesarve77/simple-chat"
});

Package.onUse(function (api) {
    api.use([
        'templating',
        'momentjs:moment@2.11.1',
        'check'
    ]),
    api.versionsFrom('1.2.1');
    api.addFiles(['publications.js'], ['server']);
    api.addFiles(['collections.js','methods.js'], ['client','server']);
    api.addFiles(['window.html', 'window.js', 'window.css','visivility.js'], ['client']);

    api.addAssets(['assets/bell.mp3','assets/close-window-xxl.png','assets/minimize-window-xxl.png','assets/maximize-window-xxl.png','assets/chat-icon.png'],'client')
    api.export('SimpleChat')
});

