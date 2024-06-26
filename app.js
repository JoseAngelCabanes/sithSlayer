function getRandomValue(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      name: "",
      confirmedName: "",
      logMessages: [],
    };
  },
  computed: {
    monsterBarStyles() {
      if (this.monsterHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },
    playerBarStyles() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },
    mayUseSpecialAttack() {
      return this.currentRound % 3 !== 0;
    },
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        // A DRAW
        this.winner = "draw";
      } else if (value <= 0) {
        // PLAYER LOST
        this.winner = "monster";
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        // A DRAW
        this.winner = "draw";
      } else if (value <= 0) {
        // MONSTER LOST
        this.winner = "player";
      }
    },
  },
  methods: {
    confirmedInput(event) {
      this.confirmedName = this.name;
      event.target.value = "";
    },
    setName(nickName, event) {
      this.name = nickName + " " + event.target.value;
    },
    startGame() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.winner = null;
      this.currentRound = 0;
      this.name = "";
      this.confirmedName = "";
      this.logMessages = [];
    },
    attackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(5, 12);
      this.monsterHealth -= attackValue;
      this.addedLogMessage("player", " attacks", attackValue);
      this.attackPlayer();
    },
    attackPlayer() {
      const attackValue = getRandomValue(8, 15);
      this.playerHealth -= attackValue;
      this.addedLogMessage("monster", " attacks", attackValue);
    },
    specialAttackMonster() {
      this.currentRound++;
      const attackValue = getRandomValue(10, 25);
      this.monsterHealth -= attackValue;
      this.addedLogMessage("player", "special attack", attackValue);
      this.attackPlayer();
    },
    healPlayer() {
      this.currentRound++;
      const healValue = getRandomValue(8, 20);
      if (this.playerHealth + healValue > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += healValue;
      }
      this.addedLogMessage("player", "heal", healValue);
      this.attackPlayer();
    },
    surrender() {
      this.winner = "monster";
    },
    addedLogMessage(who, what, value) {
      this.logMessages.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});

app.mount("#game");
