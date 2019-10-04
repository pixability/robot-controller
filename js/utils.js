export function popupWindow(url, title, win, w, h) {
    const y =  win.top.screenY + 50;
    // const x = win.top.outerWidth / 2 + win.top.screenX - ( w / 2);
    const x = win.top.screenX - ( w );
    return win.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, alwaysOnTop, width='+w+', height='+h+', top='+y+', left='+x);
}
