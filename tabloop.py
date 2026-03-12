import time
import pyautogui
import win32gui
import win32con
from PIL import ImageGrab


def find_chrome():
    def callback(hwnd, windows):
        if win32gui.IsWindowVisible(hwnd):
            title = win32gui.GetWindowText(hwnd)
            if "Google Chrome" in title or "Chrome" in title:
                windows.append(hwnd)
        return True

    windows = []
    win32gui.EnumWindows(callback, windows)
    return windows[0] if windows else None


chrome_hwnd = find_chrome()
if chrome_hwnd:
    win32gui.ShowWindow(chrome_hwnd, win32con.SW_RESTORE)
    win32gui.SetForegroundWindow(chrome_hwnd)
    time.sleep(1)

    for i in range(10):
        # Take screenshot
        img = ImageGrab.grab()
        img.save(f"D:\\AI AGENT\\antigravity-ecommerce\\chrome_tab_{i}.png")

        # Switch tab
        pyautogui.hotkey("ctrl", "tab")
        time.sleep(0.5)
else:
    print("Chrome not found")
