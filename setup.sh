#!/usr/bin/env bash
#
# MAPA MAPA — Setup completo para macOS / Linux
# Ejecutar:  bash setup.sh
#
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

REQUIRED_NODE=20

print_step()  { echo -e "\n${CYAN}[$1/$TOTAL]${NC} $2"; }
print_ok()    { echo -e "  ${GREEN}✔${NC} $1"; }
print_warn()  { echo -e "  ${YELLOW}⚠${NC} $1"; }
print_fail()  { echo -e "  ${RED}✖${NC} $1"; }

TOTAL=5

echo -e "\n${CYAN}═══════════════════════════════════════${NC}"
echo -e "${CYAN}  MAPA MAPA — Setup del proyecto${NC}"
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo -e "${CYAN}  (macOS)${NC}"
else
  echo -e "${CYAN}  (Linux)${NC}"
fi
echo -e "${CYAN}═══════════════════════════════════════${NC}"

# ── 1. Homebrew (solo macOS) ──────────────────────────────
print_step 1 "Gestor de paquetes..."

if [[ "$OSTYPE" == "darwin"* ]]; then
  if command -v brew &>/dev/null; then
    print_ok "Homebrew ya instalado"
  else
    print_warn "Homebrew no encontrado. Instalando..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

    # Agregar brew al PATH de la sesión actual (Apple Silicon vs Intel)
    if [[ -f /opt/homebrew/bin/brew ]]; then
      eval "$(/opt/homebrew/bin/brew shellenv)"
    elif [[ -f /usr/local/bin/brew ]]; then
      eval "$(/usr/local/bin/brew shellenv)"
    fi

    if command -v brew &>/dev/null; then
      print_ok "Homebrew instalado"
    else
      print_fail "No se pudo instalar Homebrew"
      exit 1
    fi
  fi
  PKG_INSTALL="brew install"
else
  if command -v apt-get &>/dev/null; then
    PKG_INSTALL="sudo apt-get install -y"
    print_ok "apt disponible"
  elif command -v dnf &>/dev/null; then
    PKG_INSTALL="sudo dnf install -y"
    print_ok "dnf disponible"
  elif command -v pacman &>/dev/null; then
    PKG_INSTALL="sudo pacman -S --noconfirm"
    print_ok "pacman disponible"
  else
    print_warn "Gestor de paquetes no reconocido — instalacion manual puede ser necesaria"
    PKG_INSTALL=""
  fi
fi

# ── 2. Git ────────────────────────────────────────────────
print_step 2 "Git..."

if command -v git &>/dev/null; then
  GIT_VER=$(git --version | awk '{print $3}')
  print_ok "Git $GIT_VER ya instalado"
else
  print_warn "Git no encontrado. Instalando..."

  if [[ "$OSTYPE" == "darwin"* ]]; then
    # En macOS, xcode-select o brew
    if command -v brew &>/dev/null; then
      brew install git
    else
      xcode-select --install 2>/dev/null || true
      echo -e "  ${YELLOW}Se abrió el instalador de Xcode Command Line Tools.${NC}"
      echo -e "  ${YELLOW}Completar la instalación y volver a ejecutar: bash setup.sh${NC}"
      exit 0
    fi
  elif [[ -n "$PKG_INSTALL" ]]; then
    $PKG_INSTALL git
  fi

  if command -v git &>/dev/null; then
    print_ok "Git instalado"
  else
    print_fail "No se pudo instalar Git"
    echo "  Instalar manualmente y volver a ejecutar este script."
    exit 1
  fi
fi

# ── 3. Node.js ────────────────────────────────────────────
print_step 3 "Node.js >= $REQUIRED_NODE..."

install_node() {
  if [[ "$OSTYPE" == "darwin"* ]] && command -v brew &>/dev/null; then
    print_warn "Instalando Node.js con Homebrew..."
    brew install node@$REQUIRED_NODE
    brew link --overwrite node@$REQUIRED_NODE 2>/dev/null || true
  else
    # Usar nvm en Linux (o macOS sin Homebrew)
    print_warn "Instalando nvm + Node.js $REQUIRED_NODE..."
    export NVM_DIR="$HOME/.nvm"
    if [[ ! -d "$NVM_DIR" ]]; then
      curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
    fi
    # Cargar nvm en la sesión actual
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
    nvm install $REQUIRED_NODE
    nvm use $REQUIRED_NODE
  fi
}

NODE_OK=false

if command -v node &>/dev/null; then
  NODE_VER=$(node -v | sed 's/v//')
  NODE_MAJOR=$(echo "$NODE_VER" | cut -d. -f1)

  if [ "$NODE_MAJOR" -ge "$REQUIRED_NODE" ]; then
    print_ok "Node.js v$NODE_VER ya instalado"
    NODE_OK=true
  else
    print_warn "Node.js v$NODE_VER encontrado pero se requiere v$REQUIRED_NODE+. Actualizando..."
    install_node
  fi
else
  print_warn "Node.js no encontrado. Instalando..."
  install_node
fi

if [ "$NODE_OK" = false ]; then
  if command -v node &>/dev/null; then
    NODE_VER=$(node -v | sed 's/v//')
    print_ok "Node.js v$NODE_VER instalado"
  else
    print_fail "No se pudo instalar Node.js"
    echo "  Instalar manualmente desde https://nodejs.org y volver a ejecutar este script."
    exit 1
  fi
fi

# ── 4. npm ────────────────────────────────────────────────
print_step 4 "npm..."

if command -v npm &>/dev/null; then
  NPM_VER=$(npm -v)
  print_ok "npm v$NPM_VER"
else
  print_fail "npm no encontrado (debería venir con Node.js)"
  echo "  Reinstalar Node.js y volver a ejecutar este script."
  exit 1
fi

# ── 5. Dependencias del proyecto ──────────────────────────
print_step 5 "Instalando dependencias del proyecto (npm install)..."

npm install

if [ $? -eq 0 ]; then
  print_ok "Todas las dependencias instaladas"
else
  print_fail "Error al instalar dependencias"
  echo ""
  echo "  Intentar:"
  echo "    npm cache clean --force"
  echo "    rm -rf node_modules package-lock.json"
  echo "    npm install"
  exit 1
fi

# ── Resumen ───────────────────────────────────────────────
echo ""
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo -e "${GREEN}  ¡Setup completo!${NC}"
echo -e "${GREEN}═══════════════════════════════════════${NC}"
echo ""
echo "  Para iniciar el servidor de desarrollo:"
echo ""
echo -e "    ${CYAN}npm run dev${NC}"
echo ""
echo "  El sitio estará en http://localhost:4321"
echo ""
