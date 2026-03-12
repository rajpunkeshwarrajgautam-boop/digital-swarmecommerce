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
    return windows


windows = find_chrome()
if windows:
    for chrome_hwnd in windows:
        try:
            win32gui.ShowWindow(chrome_hwnd, win32con.SW_MAXIMIZE)
            win32gui.SetForegroundWindow(chrome_hwnd)
        except Exception as e:
            pyautogui.click(600, 100)  # Click somewhere safe on chrome window

        time.sleep(1)

        # In current view, F12 developer console is still open. We MUST close it first.
        # Otherwise the UI scales down, which is why coordinate clicks missed!
        pyautogui.press("f12")
        time.sleep(1)

        # Maximize to double check it didn't minimize
        win32gui.ShowWindow(chrome_hwnd, win32con.SW_MAXIMIZE)
        time.sleep(1)

        # NOW with DevTools closed and window maxed out,
        # The Add New Record button is actually right over the table.
        # In chrome_modal5.png, it is at X=874, Y=337
        pyautogui.click(874, 337)
        time.sleep(1)

        # Let's take screenshot of the form
        img = ImageGrab.grab()
        img.save(f"D:\\AI AGENT\\antigravity-ecommerce\\chrome_modal8.png")
        break
else:
    print("Chrome not found")
