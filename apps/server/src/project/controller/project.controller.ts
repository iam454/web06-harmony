import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectService } from '@/project/service/project.service';
import { AccessTokenGuard } from '@/account/guard/accessToken.guard';
import { CreateProjectRequest } from '@/project/dto/project/create-project-request.dto';
import { AuthUser } from '@/account/decorator/authUser.decorator';
import { Account } from '@/account/entity/account.entity';
import { InviteUserRequest } from '@/project/dto/contributor/invite-user-request.dto';
import { UpdateContributorRequest } from '@/project/dto/contributor/update-contributor-request.dts';
import { TaskEvent } from '@/project/dto/task/task-event.dto';
import { TaskService } from '@/project/service/task.service';
import { EventType } from '@/project/enum/eventType.enum';
import { ResponseMessage } from '@/common/decorator/response-message.decorator';
import { SprintService } from '@/project/service/sprint.service';
import { SprintDetailsRequest } from '@/project/dto/sprint/sprint-details-request.dto';
import { LabelService } from '@/project/service/label.service';
import { LabelDetailsRequest } from '@/project/dto/label/label-details-request.dto';
import { ResponseStatus } from '@/common/decorator/response-status.decorator';

@UseGuards(AccessTokenGuard)
@Controller('project')
export class ProjectController {
  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
    private sprintService: SprintService,
    private labelService: LabelService
  ) {}

  @Get('invitations')
  @ResponseMessage('프로젝트 멤버 초대 목록 조회에 성공했습니다.')
  getInvitations(@AuthUser() user: Account) {
    return this.projectService.getInvitations(user.id);
  }

  @Get(':id')
  @ResponseMessage('프로젝트 상세 조회에 성공했습니다.')
  getProject(@AuthUser() user: Account, @Param('id') projectId: number) {
    return this.projectService.getProject(user.id, projectId);
  }

  @Get(':id/members')
  @ResponseMessage('프로젝트 멤버 목록 조회에 성공했습니다.')
  getMembers(@AuthUser() user: Account, @Param('id') projectId: number) {
    return this.projectService.getContributors(user.id, projectId);
  }

  @Post()
  @ResponseStatus(201)
  @ResponseMessage('프로젝트 생성이 성공했습니다.')
  create(@AuthUser() user: Account, @Body() body: CreateProjectRequest) {
    return this.projectService.create(user.id, body.title);
  }

  @Post(':id/invite')
  @ResponseMessage('프로젝트 멤버 초대가 성공했습니다.')
  async invite(
    @AuthUser() user: Account,
    @Param('id') projectId: number,
    @Body() body: InviteUserRequest
  ) {
    await this.projectService.invite(user.id, projectId, body.username);
  }

  @Patch(':id/invite')
  @ResponseMessage('프로젝트 멤버 초대 처리가 성공했습니다.')
  async updateInvitation(
    @AuthUser() user: Account,
    @Param('id') projectId: number,
    @Body() body: UpdateContributorRequest
  ) {
    await this.projectService.updateInvitation(user.id, projectId, body.contributorId, body.status);
  }

  @Post(':id/update')
  @ResponseMessage('이벤트 처리 완료했습니다.')
  async handleEvent(
    @AuthUser() user: Account,
    @Param('id') projectId: number,
    @Body() taskEvent: TaskEvent
  ) {
    const { event } = taskEvent;
    let response;
    switch (event) {
      case EventType.CREATE_TASK:
        response = await this.taskService.create(user.id, projectId, taskEvent);
        break;
      case EventType.DELETE_TASK:
        response = await this.taskService.delete(user.id, projectId, taskEvent);
        break;
      case EventType.UPDATE_POSITION:
        response = await this.taskService.move(user.id, projectId, taskEvent);
        break;
      case EventType.INSERT_TITLE:
      case EventType.DELETE_TITLE:
        response = await this.taskService.enqueue(user.id, projectId, taskEvent);
        break;
      default:
        throw new BadRequestException('올바르지 않은 이벤트 타입입니다.');
    }
    return response;
  }

  @Post(':id/sprint')
  @ResponseMessage('스프린트 생성 완료했습니다.')
  createSprint(
    @AuthUser() user: Account,
    @Param('id') id: number,
    @Body() body: SprintDetailsRequest
  ) {
    body.validate();
    return this.sprintService.create(user.id, id, body.name, body.startDate, body.endDate);
  }

  @Get(':id/sprints')
  @ResponseMessage('스프린트 목록 조회에 성공했습니다.')
  async getSprints(@AuthUser() user: Account, @Param('id') id: number) {
    return this.sprintService.getAll(user.id, id);
  }

  @Post(':id/label')
  @ResponseStatus(201)
  @ResponseMessage('라벨 생성 완료했습니다.')
  createLabel(
    @AuthUser() user: Account,
    @Param('id') id: number,
    @Body() body: LabelDetailsRequest
  ) {
    body.validate();
    return this.labelService.create(user.id, id, body.name, body.description, body.color);
  }

  @Get(':id/labels')
  @ResponseMessage('라벨 목록 조회에 성공했습니다.')
  getLabels(@AuthUser() user: Account, @Param('id') id: number) {
    return this.labelService.getAll(user.id, id);
  }

  @Get(':id/workload')
  @ResponseMessage('프로젝트 워크로드 조회에 성공했습니다.')
  getWorkload(@AuthUser() user: Account, @Param('id') id: number) {
    return this.taskService.getWorkload(user.id, id);
  }

  @Get(':id/overview')
  @ResponseMessage('프로젝트 오버뷰 조회에 성공했습니다.')
  getOverview(@AuthUser() user: Account, @Param('id') id: number) {
    return this.taskService.getOverview(user.id, id);
  }

  @Get(':id/priority')
  @ResponseMessage('프로젝트 우선순위 통계 조회에 성공했습니다.')
  getPriority(@AuthUser() user: Account, @Param('id') id: number) {
    return this.taskService.getPriority(user.id, id);
  }
}
