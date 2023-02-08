import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BossAbility } from '../models/boss-ability.model';
import { Roll } from '../models/roll.model';
import { BossService } from '../services/boss.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  bossAbilities!: BossAbility[];
  numberOfPlayers!: number;
  turnCounter: number = 1;
  diceRolls!: Roll[];

  constructor(private route: ActivatedRoute, private service: BossService) { }

  ngOnInit(): void {
    const boss = this.route.snapshot.paramMap.get("file");
    console.log(boss);
    if(boss != null) {
      this.service.getBossAbilities(boss).subscribe(
        (abilities: BossAbility[]) => {
          this.bossAbilities = abilities;
        });
    }
  }

  nextTurnClick() {
    this.turnCounter += 1
    console.log(this.rollaDie());
  }

  private rollaDie() {
    return Math.floor(Math.random() * (20) + 1);
  }

}
