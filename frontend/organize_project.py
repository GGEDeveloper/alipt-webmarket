import os
import shutil

# Caminhos principais
ROOT_DIR = os.path.join("webmarket", "frontend", "src")
APP_DIR = os.path.join(ROOT_DIR, "app")
STYLES_DIR = os.path.join(ROOT_DIR, "styles")
PUBLIC_DIR = os.path.join("webmarket", "frontend", "public")
CONFIG_DIR = os.path.join(ROOT_DIR, "config")

# Criar diretórios necessários
os.makedirs(STYLES_DIR, exist_ok=True)
os.makedirs(os.path.join(PUBLIC_DIR, "categories"), exist_ok=True)
os.makedirs(os.path.join(PUBLIC_DIR, "products"), exist_ok=True)
os.makedirs(CONFIG_DIR, exist_ok=True)

# Mover `styles/globals.css` para `src/styles/`
old_styles_path = os.path.join(APP_DIR, "styles", "globals.css")
new_styles_path = os.path.join(STYLES_DIR, "globals.css")
if os.path.exists(old_styles_path):
    shutil.move(old_styles_path, new_styles_path)
    os.rmdir(os.path.join(APP_DIR, "styles"))  # Remove pasta vazia
    print(f"✅ Movido: {old_styles_path} → {new_styles_path}")

# Mover `favicon.ico` para `public/`
old_favicon_path = os.path.join(APP_DIR, "favicon.ico")
new_favicon_path = os.path.join(PUBLIC_DIR, "favicon.ico")
if os.path.exists(old_favicon_path):
    shutil.move(old_favicon_path, new_favicon_path)
    print(f"✅ Movido: {old_favicon_path} → {new_favicon_path}")

print("🚀 Organização concluída!")
