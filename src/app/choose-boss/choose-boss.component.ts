import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Boss } from '../models/boss.model';
import { BossService } from '../services/boss.service';

@Component({
  selector: 'app-choose-boss',
  templateUrl: './choose-boss.component.html',
  styleUrls: ['./choose-boss.component.scss']
})
export class ChooseBossComponent implements OnInit {
  bosses: Boss[] = [];
  bossRows: any[] = [];

  constructor(private router: Router, private service: BossService) { }

  ngOnInit(): void {
    this.service.getBosses().subscribe(
      (bosses: Boss[]) => {
        this.bosses = bosses;

        var row = [];
        var columnCount = 1;
        for (var i = 0; i < this.bosses.length; i++) {
          if (columnCount % 3 == 0) {
            this.bossRows.push(row);
            row = [];
          }
          row.push(this.bosses[i]);
          columnCount += 1
        }
        this.bossRows.push(row);
      })
    // const boss: Boss = {
    //   id: "troll-king",
    //   name: "Troll King",
    //   subtitle: "I've never seen such a creature, it must be 50 feet tall",
    //   description: "Death, destruction, and healing. You will need to fight as a team to take down the Troll King",
    //   imagePath: "../../assets/TrollKing.jpg",
    //   colours: ["Red", "Green", "Black"],
    //   hitPoints: [20, 25, 40]
    // }
    
    // this.bosses.push(boss);
  }

  choose(valueEmitted: string) {
    console.log(valueEmitted);

    // this.service.getBossAbilities(valueEmitted).subscribe(
    //   (abilities: BossAbility[]) => {
    //     console.log(abilities);
    //   });
    this.router.navigate(['/game', { file: valueEmitted, name: "Troll King", hitPoints: 40}]);
  }

}
