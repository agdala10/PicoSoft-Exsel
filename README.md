# PicoSoft-Exsel

Hoja de cálculo nativa escrita en Rust (clean-room, sin código de terceros propietarios).
Ejecuta en macOS, Windows, Linux y BSD, y en la web vía WASM.

## Instaladores de Linux

Descárgalos desde la página de *Releases*. Verifica el checksum antes de instalar:

```sh
sha256sum -c SHA256SUMS
```

| Paquete | Instalación |
| --- | --- |
| `*.deb` (Debian/Ubuntu) | `sudo apt install ./picosoft-exsel-0.5.0-linux-x86_64.deb` |
| `*.rpm` (Fedora/openSUSE) | `sudo rpm -i picosoft-exsel-0.5.0-linux-x86_64.rpm` |
| `*.AppImage` (cualquier distro) | `chmod +x *.AppImage && ./picosoft-exsel-0.5.0-linux-x86_64.AppImage` |
| `*.flatpak` | `flatpak install --user ./picosoft-exsel-0.5.0-linux-x86_64.flatpak` |

ID de aplicación: `ai.picosoft.exsel`

## Enlaces

- Inicio: https://github.com/agdala10
- Incidencias: https://github.com/agdala10/PicoSoft-Exsel/issues
