# title: GamiAula - Forja Pixel
# author: GamiAula
# desc: Mini RPG gamificado con decisiones, ventajas y retroalimentacion
# version: 0.1
# license: MIT
import pyxel

W, H = 256, 240
HEROES = [
    ("ASTER", "LUZ", "SOMBRA", 10),
    ("BRUMA", "HIELO", "FUEGO", 12),
]
RIVALS = [
    ("UMBRAX", "SOMBRA", 8, 13),
    ("IGNOR", "FUEGO", 9, 13),
    ("NEXION", "SOMBRA", 13, 16),
]
QUESTIONS = [
    (
        ("La clase gana puntos, pero", "evita probar retos nuevos."),
        ("Premiar mas la rapidez", "Valorar estrategias y reintentos", "Reducir todos los obstaculos"),
        1,
        ("El reintento con sentido ayuda", "a superar el temor al error."),
    ),
    (
        ("Un equipo obtiene insignias,", "pero no aplica lo aprendido."),
        ("Plantear un reto en otro contexto", "Agregar mas insignias", "Aumentar la competencia"),
        0,
        ("Transferir requiere aplicar ideas", "a situaciones no ensayadas."),
    ),
    (
        ("Dos jugadores avanzan a ritmos", "muy diferentes en la mision."),
        ("Imponer la misma ruta", "Separarlos por puntuacion", "Ofrecer apoyos y rutas graduales"),
        2,
        ("Los apoyos ajustan el desafio", "sin renunciar a la meta."),
    ),
    (
        ("La mision termina rapido, pero", "nadie justifica las respuestas."),
        ("Incluir debate con evidencia", "Duplicar la recompensa", "Reducir el tiempo"),
        0,
        ("Justificar decisiones permite", "revisar el propio razonamiento."),
    ),
    (
        ("Se repite una respuesta sin", "analizar por que fue erronea."),
        ("Eliminar los reintentos", "Explicar por que se modifica", "Mostrar la solucion al instante"),
        1,
        ("Explicar cambios favorece", "la reflexion y el aprendizaje."),
    ),
    (
        ("Una persona resuelve todo", "y el equipo deja de participar."),
        ("Premiar solo al experto", "Hacer el reto mas dificil", "Rotar roles y decisiones"),
        2,
        ("Compartir responsabilidades", "favorece la participacion."),
    ),
    (
        ("La historia atrae al inicio,", "pero no afecta las decisiones."),
        ("Conectar acciones con narrativa", "Agregar musica dramatica", "Repetir el prologo"),
        0,
        ("La narrativa cobra sentido", "cuando afecta lo que se hace."),
    ),
    (
        ("Muchos fallan siempre en", "un mismo paso del desafio."),
        ("Quitar el paso", "Revisar consignas y dar pistas", "Descontar mas puntos"),
        1,
        ("Los patrones de error orientan", "ajustes a la actividad."),
    ),
    (
        ("La competencia motiva a pocos", "y va excluyendo al resto."),
        ("Dar mas premio a lideres", "Ocultar puntajes", "Agregar metas de equipo"),
        2,
        ("Los logros colectivos permiten", "reconocer progreso compartido."),
    ),
]

def key(*codes):
    return any(pyxel.btnp(c) for c in codes)

class Game:
    def __init__(self):
        pyxel.init(W, H, title="GamiAula - Forja Pixel", fps=30)
        pyxel.mouse(True)
        pyxel.sounds[0].set("c3e3g3c4", "pppp", "7777", "nnnn", 13)
        pyxel.sounds[1].set("g2e2c2", "nnn", "777", "fff", 14)
        self.reset()
        pyxel.run(self.update, self.draw)

    def reset(self):
        self.state = "title"
        self.hero = 0
        self.round = 0
        self.hp = 24
        self.ehp = RIVALS[0][3]
        self.xp = self.right = self.tries = self.qn = 0
        self.choice = self.flash = self.shake = 0
        self.good = False
        self.dmg = 0
        self.explain = ("", "")

    def start_round(self):
        self.ehp = RIVALS[self.round][3]
        self.choice = 0
        self.state = "battle"

    def evaluate(self):
        q = QUESTIONS[self.qn % len(QUESTIONS)]
        self.good = self.choice == q[2]
        self.explain = q[3]
        self.tries += 1
        if self.good:
            bonus = HEROES[self.hero][2] == RIVALS[self.round][1]
            self.dmg = 5 + (3 if bonus else 0)
            self.ehp = max(0, self.ehp - self.dmg)
            self.xp += 10 + (5 if bonus else 0)
            self.right += 1
            self.shake = 8
            pyxel.play(0, 0)
        else:
            self.dmg = 4
            self.hp = max(0, self.hp - self.dmg)
            pyxel.play(0, 1)
        self.flash = 15
        self.qn += 1
        self.state = "feedback"

    def next_step(self):
        if self.hp == 0:
            self.state = "lose"
        elif self.ehp == 0:
            self.state = "win" if self.round == len(RIVALS) - 1 else "portal"
        else:
            self.state = "battle"
            self.choice = 0

    def update(self):
        if self.flash:
            self.flash -= 1
        if self.shake:
            self.shake -= 1
        accept = key(pyxel.KEY_Z, pyxel.KEY_RETURN, pyxel.KEY_SPACE,
                     pyxel.GAMEPAD1_BUTTON_A)
        up = key(pyxel.KEY_UP, pyxel.GAMEPAD1_BUTTON_DPAD_UP)
        down = key(pyxel.KEY_DOWN, pyxel.GAMEPAD1_BUTTON_DPAD_DOWN)
        left = key(pyxel.KEY_LEFT, pyxel.GAMEPAD1_BUTTON_DPAD_LEFT)
        right = key(pyxel.KEY_RIGHT, pyxel.GAMEPAD1_BUTTON_DPAD_RIGHT)
        mouse = pyxel.btnp(pyxel.MOUSE_BUTTON_LEFT)

        if self.state == "title":
            if left or right:
                self.hero = 1 - self.hero
            if accept or (mouse and pyxel.mouse_y >= 175):
                self.start_round()
        elif self.state == "battle":
            if up:
                self.choice = (self.choice - 1) % 3
            if down:
                self.choice = (self.choice + 1) % 3
            picked = False
            if key(pyxel.KEY_1, pyxel.KEY_2, pyxel.KEY_3):
                if pyxel.btnp(pyxel.KEY_1):
                    self.choice = 0
                elif pyxel.btnp(pyxel.KEY_2):
                    self.choice = 1
                else:
                    self.choice = 2
                picked = True
            if mouse and 160 <= pyxel.mouse_y < 217:
                self.choice = min(2, (pyxel.mouse_y - 160) // 19)
                picked = True
            if accept or picked:
                self.evaluate()
        elif self.state == "feedback":
            if accept or mouse:
                self.next_step()
        elif self.state == "portal":
            if accept or mouse:
                self.round += 1
                self.start_round()
        elif self.state in ("win", "lose"):
            if accept or mouse:
                self.reset()

    def panel(self, x, y, w, h, color=10):
        pyxel.rect(x, y, w, h, 0)
        pyxel.rectb(x, y, w, h, color)
        pyxel.rectb(x + 2, y + 2, w - 4, h - 4, 1)

    def bg(self):
        pyxel.cls(1)
        pyxel.rect(0, 0, W, 121, 0)
        for i in range(33):
            x, y = (i * 79 + 13) % W, (i * 43 + 7) % 98
            pyxel.pset(x, y, 7 if i % 4 == 0 else 5)
        pyxel.rect(0, 105, W, 17, 5)
        for i in range(15):
            pyxel.rectb(i * 18, 105, 19, 15, 13)
        pyxel.rect(0, 122, W, 118, 1)

    def sprite(self, x, y, color, scale=1):
        def r(a, b, w, h, c):
            pyxel.rect(x+a*scale, y+b*scale, w*scale, h*scale, c)
        r(8, 0, 10, 4, color)
        r(5, 4, 16, 9, color)
        r(6, 6, 14, 5, 7)
        r(9, 7, 2, 2, 0)
        r(16, 7, 2, 2, 0)
        r(6, 13, 17, 9, color)
        r(9, 16, 9, 3, 7)
        r(3, 20, 5, 8, 5)
        r(9, 22, 5, 8, 13)
        r(18, 22, 5, 8, 13)
        r(26, 8, 2, 18, 7)
        r(23, 13, 9, 3, 10)

    def monster(self, x, y):
        color = RIVALS[self.round][2]
        jiggle = pyxel.frame_count // 13 % 2
        offset = 2 if self.shake % 2 else 0
        x += offset
        pyxel.rect(x + 4, y + 5 + jiggle, 27, 23, color)
        pyxel.rect(x, y + 12 + jiggle, 35, 10, color)
        pyxel.rect(x + 7, y + 27 + jiggle, 6, 8, color)
        pyxel.rect(x + 23, y + 27 + jiggle, 6, 8, color)
        pyxel.rect(x + 7, y + 14 + jiggle, 6, 5, 0)
        pyxel.rect(x + 23, y + 14 + jiggle, 6, 5, 0)
        pyxel.pset(x + 10, y + 15 + jiggle, 7)
        pyxel.pset(x + 26, y + 15 + jiggle, 7)
        pyxel.line(x + 14, y + 24 + jiggle, x + 21, y + 24 + jiggle, 0)
        pyxel.line(x + 5, y + 10, x - 3, y + 1, 8)
        pyxel.line(x + 30, y + 10, x + 37, y + 1, 8)

    def bar(self, x, y, amount, maximum, c):
        pyxel.rect(x, y, 73, 7, 5)
        pyxel.rect(x+1, y+1, int(71*amount/maximum), 5, c)
        pyxel.rectb(x, y, 73, 7, 7)

    def battletop(self):
        self.bg()
        pyxel.rect(7, 5, 242, 22, 1)
        pyxel.rectb(7, 5, 242, 22, 13)
        pyxel.text(14, 12, "FORJA PIXEL", 10)
        pyxel.text(117, 12, f"SALA {self.round+1}/3", 7)
        pyxel.text(196, 12, f"XP:{self.xp}", 11)
        pyxel.text(8, 34, HEROES[self.hero][0] + " / " + HEROES[self.hero][1], 7)
        pyxel.text(156, 34, RIVALS[self.round][0], 7)
        self.bar(8, 45, self.hp, 24, 11)
        self.bar(156, 45, self.ehp, RIVALS[self.round][3], 8)
        self.sprite(43, 71, HEROES[self.hero][3])
        if self.ehp:
            self.monster(175, 65)
        else:
            pyxel.text(178, 90, "* VENCIDO *", 10)
        if self.flash and self.good:
            pyxel.circb(179, 87, self.flash + 3, 10)
        if self.flash and not self.good:
            pyxel.line(92, 92, 92 + self.flash, 82, 8)
        pyxel.text(113, 77, "VS", 7)
        pyxel.text(107, 94, "VENTAJA!" if HEROES[self.hero][2] == RIVALS[self.round][1] else "NEUTRO", 10)
        pyxel.text(8, 112, f"ACIERTOS {self.right}/{self.tries}", 11)

    def draw(self):
        if self.state == "title":
            self.bg()
            self.panel(17, 11, 222, 44)
            pyxel.text(77, 21, "G A M I A U L A", 10)
            pyxel.text(61, 37, "F O R J A   P I X E L", 7)
            pyxel.text(41, 68, "Batallas de criterio educativo", 7)
            self.sprite(104, 94, HEROES[self.hero][3], 2)
            self.panel(20, 162, 216, 53)
            pyxel.text(73, 170, "ELIGE CRIATURA", 10)
            pyxel.text(59, 181, "< " + HEROES[self.hero][0] + " / " + HEROES[self.hero][1] + " >", 7)
            pyxel.text(55, 193, "VENTAJA VS " + HEROES[self.hero][2], 11)
            pyxel.text(49, 224, "FLECHAS + Z / ENTER", 7)
            return

        if self.state in ("battle", "feedback", "portal"):
            self.battletop()
            if self.state == "battle":
                q = QUESTIONS[self.qn % len(QUESTIONS)]
                self.panel(5, 125, 246, 109)
                pyxel.text(13, 132, "DESAFIO DE CRITERIO", 10)
                pyxel.text(13, 142, q[0][0], 7)
                pyxel.text(13, 151, q[0][1], 7)
                for i, option in enumerate(q[1]):
                    y = 163 + i*19
                    if i == self.choice:
                        pyxel.rect(11, y-2, 232, 15, 5)
                        pyxel.rectb(11, y-2, 232, 15, 10)
                    pyxel.text(16, y+1, f"{i+1}. {option}", 7 if i == self.choice else 13)
                pyxel.text(13, 223, "ARRIBA/ABAJO + Z   |   1,2,3", 11)
            elif self.state == "feedback":
                self.panel(12, 132, 232, 96, 11 if self.good else 8)
                pyxel.text(68, 143, "GOLPE CERTERO" if self.good else "CONTRAATAQUE", 11 if self.good else 8)
                pyxel.text(35, 159, f"DANO: {self.dmg}   XP: {self.xp}", 7)
                pyxel.text(19, 176, self.explain[0], 7)
                pyxel.text(19, 187, self.explain[1], 7)
                pyxel.text(56, 213, "Z: CONTINUAR", 10)
            else:
                self.panel(18, 135, 220, 92, 11)
                pyxel.text(64, 148, "GUARDIAN VENCIDO", 11)
                pyxel.text(48, 166, "Tu criterio abre el portal.", 7)
                pyxel.text(72, 182, f"XP TOTAL: {self.xp}", 10)
                pyxel.text(51, 213, "Z: SIGUIENTE SALA", 7)
            return

        self.bg()
        self.panel(15, 18, 226, 197, 10 if self.state == "win" else 8)
        pyxel.text(64, 37, "FORJA COMPLETADA" if self.state == "win" else "FIN DEL INTENTO", 11)
        self.sprite(106, 55, HEROES[self.hero][3], 2)
        pyxel.text(69, 128, f"EXPERIENCIA: {self.xp} XP", 7)
        pyxel.text(69, 142, f"ACIERTOS: {self.right}/{self.tries}", 7)
        pyxel.text(39, 162, "Tus decisiones importan." if self.state == "win" else "El reintento tambien ensena.", 10)
        pyxel.text(47, 198, "Z: VOLVER A JUGAR", 7)
        pyxel.text(37, 226, "DEMO SIN GUARDADO EN LA NUBE", 13)

Game()
