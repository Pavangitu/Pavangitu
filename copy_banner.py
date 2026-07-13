import os
import shutil

# Directories
current_dir = os.path.dirname(os.path.abspath(__file__))
public_dir = os.path.join(current_dir, "public")

# Create public directory if it doesn't exist
if not os.path.exists(public_dir):
    os.makedirs(public_dir)
    print("Created public/ directory.")

# Source files
banner_src = r"C:\Users\pavan\.gemini\antigravity-ide\brain\e74391a2-d404-40b7-8e1a-8b6b002c7dc6\github_banner_1783868542636.png"
luffy_walk_src = r"C:\Users\pavan\.gemini\antigravity-ide\brain\2e30d2a9-fe34-4e0b-8592-cbe0acb40a9f\media__1783871515876.png"
luffy_wave_src = r"C:\Users\pavan\.gemini\antigravity-ide\brain\2e30d2a9-fe34-4e0b-8592-cbe0acb40a9f\media__1783871515692.png"
luffy_laugh_src = r"C:\Users\pavan\.gemini\antigravity-ide\brain\2e30d2a9-fe34-4e0b-8592-cbe0acb40a9f\media__1783871515863.png"

# Copy list: (src, dst_filename)
copy_jobs = []

if os.path.exists(banner_src):
    copy_jobs.append((banner_src, "github_banner.png"))
else:
    print(f"Warning: Cached banner not found at {banner_src}")

luffy_sprites = [
    (luffy_walk_src, "luffy_walk.png"),
    (luffy_wave_src, "luffy_wave.png"),
    (luffy_laugh_src, "luffy_laugh.png")
]

for src, dst in luffy_sprites:
    if os.path.exists(src):
        copy_jobs.append((src, dst))
    else:
        print(f"Warning: Luffy sprite not found at {src}")

# Add root assets to copy to public so Vite can serve them
root_assets = [
    "README.md",
    "Pavan-Datta-Gedila1.pdf",
    "pavan Profile.pdf",
    "pavan datta.pdf",
    "luffy_widget.svg"
]

for asset in root_assets:
    asset_path = os.path.join(current_dir, asset)
    if os.path.exists(asset_path):
        copy_jobs.append((asset_path, asset))

# Execute copying to public
for src, name in copy_jobs:
    dst_path = os.path.join(public_dir, name)
    try:
        shutil.copy2(src, dst_path)
        print(f"Copied {name} to public/ directory.")
    except Exception as e:
        print(f"Error copying {name} to public: {e}")

# Also copy github_banner.png and luffy sprites to root for GitHub compatibility
root_copies = ["github_banner.png", "luffy_walk.png", "luffy_wave.png", "luffy_laugh.png"]
for name in root_copies:
    pub_src = os.path.join(public_dir, name)
    if os.path.exists(pub_src):
        try:
            shutil.copy2(pub_src, os.path.join(current_dir, name))
            print(f"Copied {name} to root directory.")
        except Exception as e:
            print(f"Error copying {name} to root: {e}")
