import { NONE_TYPE } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BossAbility } from '../models/boss-ability.model';
import { Boss } from '../models/boss.model';
import { Roll } from '../models/roll.model';
import { BossService } from '../services/boss.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  bossAbilities: BossAbility[] = [];
  numberOfPlayers: number = 1;
  turnCounter: number = 1;
  diceRolls!: Roll[];
  bossName!: string;
  bossHitPoints!: number;
  gameStarted: boolean = false;
  playerDamage: number = 0;

  constructor(private route: ActivatedRoute, private service: BossService) { }

  ngOnInit(): void {
    const boss = this.route.snapshot.paramMap.get("file");
    this.bossName = this.route.snapshot.paramMap.get("name") ?? '';
    this.bossHitPoints = Number(this.route.snapshot.paramMap.get("hitPoints")) ?? 0;

    if(boss != null) {
      this.service.getBossAbilities(boss).subscribe(
        (abilities: BossAbility[]) => {
          this.bossAbilities = abilities;
        });
    }
  }

  startGameClick() {
    this.gameStarted = true;
    this.bossHitPoints = this.bossHitPoints * this.numberOfPlayers
  }

  bossTurnClick() {
    this.bossHitPoints -= this.playerDamage;

    this.diceRolls = [];

    if (this.bossHitPoints <= 0) {
      for (var i = 0; i < 10; i++) {
        const roll: Roll = {
          dieValue: 0,
          ability: "You Win!!!"
        }
        this.diceRolls.push(roll);
      }
      return;
    }

    if (this.turnCounter == 1) {
      const roll: Roll = {
        dieValue: 0,
        ability: "The boss does nothing"
      }
      this.diceRolls.push(roll);
    } else {

      let rolls = 0
      
      if (this.turnCounter % 2 == 0) {
        rolls = this.turnCounter / 2;
      } else {
        rolls = (this.turnCounter - 1) / 2;
      }

      for (var i = 1; i <= rolls; i++) {
        const dieRoll = this.rollaDie();
        var ability = this.getBossAbilityFromDieRoll(dieRoll);
        var abilityText = this.processAbility(ability, rolls);

        const roll: Roll = {
          dieValue: dieRoll,
          ability: abilityText
        }
        this.diceRolls.push(roll);
      }
    }
  }

  nextTurnClick() {
    this.turnCounter += 1;
    this.diceRolls = [];
    this.playerDamage = 0;
  }


  private rollaDie() {
    return Math.floor(Math.random() * (20) + 1);
  }

  private getBossAbilityFromDieRoll(dieRoll: number): BossAbility {
    for (var i = 0; i < this.bossAbilities.length; i++) {
      if (this.bossAbilities[i].dice.indexOf(dieRoll) > -1) {
        return this.bossAbilities[i];
      }
    }

    const empty: BossAbility = {
      dice: [0],
      bossEffect: "",
      text: "not found"
    }
    return empty;
  }

  private processAbility(ability: BossAbility, rolls: number): string {
    var text = ability.text.replace("{x}", String(rolls));
    var amount: number = 0;

    if (text.indexOf("{xp}") > 0) {
      amount = this.numberOfPlayers * rolls;
      text = text.replace("{xp}", String(amount));
    }

    // checks for a formula pattern, i.e. {x*2}, {X+1}, {x/2}
    const pattern = /\{x(\+|\*|\/)\d{1}\}/;
    if(pattern.test(text)) {
      var match = text.match(pattern);
      if (match != null) {
        
        var operator = match[0].substring(2,3);
        var constant = Number(match[0].substring(3,4));

        if (operator == "+") {
          amount = rolls + constant;
        } else if (operator == "*") {
          amount = rolls * constant;
        } else if (operator == "/") {
          // divide is always by 2, too hard to make it anything else
          if (rolls % 2 == 0) {
            amount = rolls / 2;
          } else {
            amount = (rolls + 1) / 2
          }
        }

        text = text.replace(match[0], String(amount));
      }
    }

    // eventually could expand this for more boss effects
    if (ability.bossEffect != "") {
      console.log(ability.bossEffect);
      var parts = ability.bossEffect.split(',');
      var effect = parts[0];

      if (effect == "life") {
        this.bossHitPoints += amount;
      }
    }

    return text;
  }

}
