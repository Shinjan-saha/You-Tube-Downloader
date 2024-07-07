import os
import yt_dlp as youtube_dl

def create_download_folder(folder_name="Downloaded_Videos"):
    # Get the current working directory
    cwd = os.getcwd()
    
    # Create the full path for the download folder
    download_path = os.path.join(cwd, folder_name)
    
    # Create the folder if it doesn't exist
    if not os.path.exists(download_path):
        os.makedirs(download_path)
        print(f"Created folder: {download_path}")
    else:
        print(f"Folder already exists: {download_path}")
    
    return download_path

def download_youtube_video(url, download_path):
    ydl_opts = {
        'outtmpl': f'{download_path}/%(title)s.%(ext)s',
        'format': 'best',  # You can change 'best' to other formats like 'mp4'
    }
    
    with youtube_dl.YoutubeDL(ydl_opts) as ydl:
        print("Downloading video...")
        ydl.download([url])
        print("Download complete!")

if __name__ == "__main__":
    print("Welcome to the YouTube Video Downloader")
    print("Please follow the instructions below to download a YouTube video.\n")
    
    video_url = input("Enter the YouTube video URL: ")
    
    # Create the download folder
    download_path = create_download_folder()
    
    print("\nStarting download...")
    download_youtube_video(video_url, download_path)
    print("\nVideo has been downloaded successfully!")
